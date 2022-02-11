const { Op } = require("sequelize");
const { product: ProductModel, sequelize } = require("../models");
const { notFound } = require("../libs/errors");

class Product {
  static async getAll() {
    return await ProductModel.findAll();
  }
  static async saveProduct(data) {
    console.log(data,"----------------------")
    return ProductModel.create(data);
  }
  static async deleteProduct(id) {
    try {
      await ProductModel.destroy({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error(error, "--------------error");
      return false;
    }
  }
  static async updateProduct(id, data) {
    const course = await ProductModel.findOne({ where: { id } });
    if (!course) {
      throw notFound();
    }
    return course.update(data);
  }
}

module.exports = Product;
