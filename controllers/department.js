const { department: DepartmentModel } = require("../models");
const { notFound } = require("../libs/errors");

class Department {
  static async getByType(type) {
    return await DepartmentModel.findAll({
      where: { type },
    });
  }
  static async getAll() {
    return await DepartmentModel.findAll();
  }
  static async saveDepartment(data) {
    return DepartmentModel.create(data);
  }
  static async deleteDepartment(id) {
    try {
      await DepartmentModel.destroy({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error(error, "--------------error");
      return false;
    }
  }
  static async updateDepartment(id, data) {
    const course = await DepartmentModel.findOne({ where: { id } });
    if (!course) {
      throw notFound();
    }
    return course.update(data);
  }
}

module.exports = Department;
