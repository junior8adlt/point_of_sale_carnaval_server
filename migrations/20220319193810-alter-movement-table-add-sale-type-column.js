'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('movement', 'sale_type', {
          type: Sequelize.ENUM(["GENERAL", "CORTESIA", 'GRATIS']),
        }, { transaction: t })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('movement', 'sale_type', { transaction: t })
      ]);
    });
  }
};
