'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    static associate(models) {
      Client.hasMany(models.Booking, { foreignKey: 'ClientID' });
      Client.belongsTo(models.Employee, { foreignKey: 'managedByEmployeeId', as: 'AccountManager' });
    }
  }

  Client.init({
    clientId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'clientId'
    },
    Name: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: 'name'
    },
    Email: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
      field: 'email'
    },
    Address: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'address'
    },
    ContactNumber: {
      type: DataTypes.STRING(15),
      allowNull: false,
      field: 'contactNumber'
    },
    CustomerType: {
      type: DataTypes.ENUM('REGULAR', 'CORPORATE', 'VIP'),
      defaultValue: 'REGULAR',
      field: 'customerType'
    },
    DateRegistered: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'dateRegistered'
    },
    managedByEmployeeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'employee',
        key: 'employeeId'
      },
      field: 'managedByEmployeeId'
    }
  }, {
    sequelize,
    modelName: 'Client',
    tableName: 'client',
    timestamps: false,
  });

  return Client;
};