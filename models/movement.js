'use strict';
module.exports = (sequelize, DataTypes) => {
  const Movement = sequelize.define('movement', {
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
      defaultValue: 0,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    type: {
      type: DataTypes.ENUM(["PURCHASE", "SALE"]),
      allowNull: false,
    },
    departmentId: {
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
  }, {
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
  });
  Movement.associate = function(models) {
    // associations can be defined here
    Movement.belongsTo(models.product, {
      targetKey: "id",
      foreignKey: "product_id",
    });
    Movement.belongsTo(models.department, {
      targetKey: "id",
      foreignKey: "department_id",
    });
  };
  return Movement;
};