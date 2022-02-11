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
    console.log(where,"-----------------where")
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
      await TransferModel.bulkCreate(transfers);
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
