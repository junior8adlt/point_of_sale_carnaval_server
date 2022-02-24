const {
  transfer: TransferModel,
  product: ProductModel,
  department: DepartmentModel,
  sequelize,
} = require("../models");
const { notFound } = require("../libs/errors");

const TRANSFER_TYPES = {
  STOCK: "departmentIdTo",
  RETURN: "departmentIdFrom",
};

class Transfer {
  static async getByDepartment(id, type = "STOCK", date) {
    const where = { [TRANSFER_TYPES[type]]: id };
    if (date) {
      where.createdAt = sequelize.where(
        sequelize.fn("date", sequelize.col("transfer.created_at")),
        "=",
        date
      );
    }
    return await TransferModel.findAll({
      where,
      include: [
        {
          model: DepartmentModel,
          as: "departmentFrom",
          required: true,
        },
        {
          model: DepartmentModel,
          as: "departmentTo",
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
          as: "departmentFrom",
          required: true,
        },
        {
          model: DepartmentModel,
          as: "departmentTo",
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
    console.log(transfers, "--------------");
    return transfers;
  }
  static async saveTransfers(transfers) {
    try {
      const date = new Date();
      const month = date.getMonth() + 1;
      const monthFormat = String(month).length === 1 ? `0${month}` : `${month}`;
      const onlyDate = `${date.getFullYear()}-${monthFormat}-${date.getDate()}`;
      const transfersWithDate = transfers.map((transfer) => ({
        ...transfer,
        date: onlyDate,
      }));
      await TransferModel.bulkCreate(transfersWithDate);
      return true;
    } catch (error) {
      console.error(error, "------------error");
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
      console.error(error, "--------------error");
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
