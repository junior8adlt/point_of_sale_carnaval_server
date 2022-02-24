"use strict";
module.exports = (sequelize, DataTypes) => {
  const Transfer = sequelize.define(
    "transfer",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      departmentIdFrom: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: 'department',
            schema: 'public'
          },
          key: 'id'
        },
      },
      departmentIdTo: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: 'department',
            schema: 'public'
          },
          key: 'id'
        },
      },
      productId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: 'product',
            schema: 'public'
          },
          key: 'id'
        },
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
    }
  );
  Transfer.associate = function (models) {
    // associations can be defined here
    Transfer.belongsTo(models.product, {
      targetKey: "id",
      foreignKey: "product_id",
    });
    Transfer.belongsTo(models.department, {
      targetKey: "id",
      as: "departmentTo",
      foreignKey: "department_id_to",
    });
    Transfer.belongsTo(models.department, {
      targetKey: "id",
      as: "departmentFrom",
      foreignKey: "department_id_from",
    });
  };
  return Transfer;
};
