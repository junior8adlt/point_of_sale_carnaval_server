const {
  movement: MovementModel,
  product: ProductModel,
  department: DepartmentModel,
  transfer: TransferModel,
  sequelize,
} = require('../models');
const { notFound } = require('../libs/errors');
const { Op } = require('sequelize');

const MOVEMENT_TYPES = ['PURCHASE', 'SALE'];

class Movement {
  static async getByDepartment(id) {
    return await MovementModel.findAll({
      where: { departmentId: id },
      include: [
        {
          model: DepartmentModel,
          required: true,
        },
        {
          model: ProductModel,
          required: true,
        },
      ],
    });
  }

  static async getByDepartmentAndType(id, type, date) {
    const where = { type, departmentId: id }
    if (date) {
      where.date = date
    }
    return await MovementModel.findAll({
      where,
      include: [
        {
          model: DepartmentModel,
          required: true,
        },
        {
          model: ProductModel,
          required: true,
        },
      ],
    });
  }

  static async getResumeByDepartmentAndDate(id, date) {
    const [GENERAL, CORTESIA, GRATIS] = ["GENERAL", "CORTESIA", 'GRATIS']
    const movements = await MovementModel.findAll({
      where: {
        date,
      },
      include: [
        {
          model: DepartmentModel,
          required: true,
          where: { id },
        },
        {
          model: ProductModel,
          required: true,
        },
      ],
      nest: true,
      raw: true,
    });

    const freeProducts = [];
    const purchaseProducts = [];
    const saleProducts = [];
    let totalSale = 0;
    let totalSaleAtFactoryCost = 0;
    let totalSaleCommission = 0;
    let totalFreeSale = 0;
    let wareHouseTotalFinal = 0;
    // la suma de totalFreeAmountSaleProduct y totalAmountSaleProduct debe ser igual a totalAmountProductTransfered
    // si vendió todo
    let totalAmountSaleProduct = 0;
    let totalAmountPurchaseProduct = 0;
    let totalFreeAmountSaleProduct = 0;
    let totalProductAmountToReturn = 0;
    movements.forEach((movement, index) => {
      const movementTotalSaleAtFactoryCost = +movement.amount * +movement.product.factoryPrice
      movements[index].totalSaleAtFactoryCost = movementTotalSaleAtFactoryCost
      if (movement.saleType === GRATIS && movement.type === 'SALE') {
        freeProducts.push(movement);
        totalFreeAmountSaleProduct += movement.amount;
        totalFreeSale += movement.amount * movement.product.price;
        totalSaleAtFactoryCost += movementTotalSaleAtFactoryCost
      } else if (movement.type === 'PURCHASE') {
        purchaseProducts.push(movement);
        totalAmountPurchaseProduct += movement.amount;
      } else if (movement.type === 'SALE') {
        saleProducts.push(movement);
        totalSale += movement.total;
        totalAmountSaleProduct += movement.amount;
        if (movement.saleType === GENERAL) {
          totalSaleCommission += +movement.amount * +movement.product.comission;
        }
        totalSaleAtFactoryCost += movementTotalSaleAtFactoryCost
      }
    });
    totalSale += totalFreeSale;
    wareHouseTotalFinal = totalSale - totalSaleCommission - totalFreeSale;

    let totalAmountProductTransfered = 0;
    let totalOriginalProductPrice = 0;
    const transfers = await TransferModel.findAll({
      where: {
        date,
        [Op.or]: [
          {
            departmentIdTo: id,
          },
          {
            departmentIdFrom: id,
          },
        ],
      },
      include: [
        {
          model: DepartmentModel,
          required: true,
          as: 'departmentTo',
        },
        {
          model: DepartmentModel,
          as: 'departmentFrom',
          required: true,
        },
        {
          model: ProductModel,
          required: true,
        },
      ],
      nest: true,
      raw: true,
    });
    const productSend = [];
    const productReturned = [];
    transfers.forEach((transfer) => {
      if (transfer.departmentIdTo == id) {
        productSend.push(transfer);
      } else {
        productReturned.push(transfer);
      }
    });
    productSend.forEach((transfer) => {
      totalAmountProductTransfered += transfer.amount;
      totalOriginalProductPrice += transfer.amount * transfer.product.price;
    });
    totalProductAmountToReturn =
      totalAmountProductTransfered -
      totalAmountSaleProduct -
      totalFreeAmountSaleProduct;
    const response = {
      metrics: {
        totalSale, // venta total
        totalSaleCommission, // comision que hay que dar por la venta total
        totalFreeSale, // venta regalada
        totalAmountSaleProduct, // productos vendidos
        totalAmountPurchaseProduct, // productos comprados
        totalFreeAmountSaleProduct, // productos regalados
        totalAmountProductTransfered, // productos que tiene el departamento ese día
        totalOriginalProductPrice, // valor de la mercancia que tiene ese departamento
        wareHouseTotalFinal, // valor de la final del almacen
        totalProductAmountToReturn, // productos que se deben devolver
        totalSaleAtFactoryCost, // venta total a costo de fabrica
      },
      movements,
      transfers: {
        send: productSend,
        returned: productReturned,
      },
    };
    return response;
  }

  static async getAll() {
    const movements = await MovementModel.findAll({
      include: [
        {
          model: DepartmentModel,
          required: true,
        },
        {
          model: ProductModel,
          required: true,
        },
      ],
    });
    return movements;
  }
  static async saveMovements(movements) {
    try {
      // const date = new Date();
      // const month = date.getMonth() + 1;
      // const monthFormat = String(month).length === 1 ? `0${month}` : `${month}`;
      // const onlyDate = `${date.getFullYear()}-${monthFormat}-${date.getDate()}`;
      // const movementsWithDate = movements.map((movement) => ({
      //   ...movement,
      //   date: onlyDate,
      // }));
      await MovementModel.bulkCreate(movements);
      const [purchaseType] = MOVEMENT_TYPES;
      const purchases = movements.filter(
        (movement) => movement.type === purchaseType
      );
      const transfers = purchases.map(
        ({ description, departmentId, productId, amount, date }) => ({
          description: `${purchaseType}-${description}`,
          departmentIdFrom: departmentId,
          departmentIdTo: departmentId,
          productId: productId,
          amount: amount,
          date,
        })
      );
      await TransferModel.bulkCreate(transfers);
      return true;
    } catch (error) {
      console.error(error, '------------error');
      return false;
    }
  }
  static async deleteMovement(id) {
    try {
      await MovementModel.destroy({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error(error, '--------------error');
      return false;
    }
  }
  static async updateMovement(id, data) {
    const course = await MovementModel.findOne({ where: { id } });
    if (!course) {
      throw notFound();
    }
    return course.update(data);
  }
}

module.exports = Movement;
