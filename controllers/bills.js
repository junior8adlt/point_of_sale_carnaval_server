const { bills: BillsModel, sequelize } = require('../models');
const { notFound } = require('../libs/errors');

class Bills {
  static async getAllBills() {
    return await BillsModel.findAll();
  }
  static async saveBill(data) {
    return BillsModel.create(data);
  }
  static async deleteBill(id) {
    try {
      await BillsModel.destroy({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error(error, '--------------error');
      return false;
    }
  }
  static async updateBill(id, data) {
    console.log(id, data, '------------------id, data');
    const bill = await BillsModel.findOne({ where: { id } });
    if (!bill) {
      throw notFound();
    }
    return bill.update(data);
  }
}

module.exports = Bills;
