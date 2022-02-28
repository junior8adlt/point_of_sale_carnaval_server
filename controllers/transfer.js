const {
  transfer: TransferModel,
  product: ProductModel,
  department: DepartmentModel,
  sequelize,
} = require('../models');
const { notFound } = require('../libs/errors');

const TRANSFER_TYPES = {
  STOCK: 'departmentIdTo',
  RETURN: 'departmentIdFrom',
};

class Transfer {
  static async getInventory(departmentId) {
    const totalSalesByProduct = await sequelize.query(
      `
    SELECT SUM(amount), movement.product_id  FROM movement WHERE type = 'SALE' AND total > 0 GROUP BY product_id
    `,
      { type: sequelize.QueryTypes.SELECT }
    );
    const totalStockByProduct = await sequelize.query(
      `
      SELECT SUM(amount), t.product_id, p.name FROM  transfer t inner join product p on p.id = t.product_id 
      WHERE t.department_id_from = ${departmentId} AND t.department_id_to = ${departmentId} 
      GROUP BY product_id, p.name
    `,
      { type: sequelize.QueryTypes.SELECT }
    );

    const totalInventoryStock = totalStockByProduct.map((product) => {
      const totalSale = totalSalesByProduct.find(
        (sale) => sale.product_id === product.product_id
      );
      return {
        ...product,
        sum: product.sum - (totalSale ? totalSale.sum : 0),
      };
    });

    return totalInventoryStock;
  }

  static async getByDepartment(id, type = 'STOCK', date) {
    const where = { [TRANSFER_TYPES[type]]: id };
    if (date) {
      where.createdAt = sequelize.where(
        sequelize.fn('date', sequelize.col('transfer.created_at')),
        '=',
        date
      );
    }
    return await TransferModel.findAll({
      where,
      include: [
        {
          model: DepartmentModel,
          as: 'departmentFrom',
          required: true,
        },
        {
          model: DepartmentModel,
          as: 'departmentTo',
          required: true,
        },
        {
          model: ProductModel,
          required: true,
        },
      ],
    });
  }

  static async getAll() {
    const transfers = await TransferModel.findAll({
      include: [
        {
          model: DepartmentModel,
          as: 'departmentFrom',
          required: true,
        },
        {
          model: DepartmentModel,
          as: 'departmentTo',
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
    console.log(transfers, '--------------');
    return transfers;
  }
  static async saveTransfers(transfers) {
    try {
      // const date = new Date();
      // const month = date.getMonth() + 1;
      // const monthFormat = String(month).length === 1 ? `0${month}` : `${month}`;
      // const onlyDate = `${date.getFullYear()}-${monthFormat}-${date.getDate()}`;
      // const transfersWithDate = transfers.map((transfer) => ({
      //   ...transfer,
      //   date: onlyDate,
      // }));
      await TransferModel.bulkCreate(transfers);
      return true;
    } catch (error) {
      console.error(error, '------------error');
      return false;
    }
  }
  static async deleteTransfer(id) {
    try {
      await TransferModel.destroy({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error(error, '--------------error');
      return false;
    }
  }
  static async updateTransfer(id, data) {
    const transfer = await TransferModel.findOne({ where: { id } });
    if (!transfer) {
      throw notFound();
    }
    return transfer.update(data);
  }
}

module.exports = Transfer;
