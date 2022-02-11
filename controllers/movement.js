const {
  movement: MovementModel,
  product: ProductModel,
  department: DepartmentModel,
  transfer: TransferModel,
  sequelize,
} = require("../models");
const { notFound } = require("../libs/errors");

const MOVEMENT_TYPES = ["PURCHASE", "SALE"];

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
  static async getByDepartmentAndType(id, type) {
    return await MovementModel.findAll({
      where: { type, departmentId: id },
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
    const movements = await MovementModel.findAll({
      where: sequelize.where(
        sequelize.fn("date", sequelize.col("movement.created_at")),
        "=",
        date
      ),
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
    let totalSaleCommission = 0;
    let totalFreeSale = 0;
    // la suma de totalFreeAmountSaleProduct y totalAmountSaleProduct debe ser igual a totalAmountProductTransfered
    // si vendió todo
    let totalAmountSaleProduct = 0;
    let totalAmountPurchaseProduct = 0;
    let totalFreeAmountSaleProduct = 0;
    movements.forEach((movement) => {
      if (movement.total === 0 && movement.type === "SALE") {
        freeProducts.push(movement);
        totalFreeAmountSaleProduct += movement.amount;
        totalFreeSale += movement.amount * movement.product.price;
      } else if (movement.type === "PURCHASE") {
        purchaseProducts.push(movement);
        totalAmountPurchaseProduct += movement.amount;
      } else {
        saleProducts.push(movement);
        totalSale += movement.total;
        totalAmountSaleProduct += movement.amount;
        totalSaleCommission +=
          (+movement.total * +movement.product.comission) / 100;
      }
    });
    let totalAmountProductTransfered = 0;
    let totalOriginalProductPrice = 0;
    const transfers = await TransferModel.findAll({
      where: sequelize.where(
        sequelize.fn("date", sequelize.col("transfer.created_at")),
        "=",
        date
      ),
      include: [
        {
          model: DepartmentModel,
          required: true,
          as: "departmentTo",
          where: { id },
        },
        {
          model: DepartmentModel,
          as: "departmentFrom",
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

    transfers.forEach((transfer) => {
      totalAmountProductTransfered += transfer.amount;
      totalOriginalProductPrice += transfer.amount * transfer.product.price;
    });

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
      },
      movements,
      transfers,
    };
    console.log({ movements }, "---------movements-------");
    console.log({ transfers }, "---------transfers-------");
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
    console.log(movements, "--------------");
    return movements;
  }
  static async saveMovements(movements) {
    try {
      await MovementModel.bulkCreate(movements);
      const [purchaseType] = MOVEMENT_TYPES;
      const purchases = movements.filter(
        (movement) => movement.type === purchaseType
      );
      const transfers = purchases.map(
        ({ description, departmentId, productId, amount }) => ({
          description: `${purchaseType}-${description}`,
          departmentIdFrom: departmentId,
          departmentIdTo: departmentId,
          productId: productId,
          amount: amount,
        })
      );
      await TransferModel.bulkCreate(transfers);
      return true;
    } catch (error) {
      console.error(error, "------------error");
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
      console.error(error, "--------------error");
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
