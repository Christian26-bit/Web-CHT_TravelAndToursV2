'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      Employee.hasMany(models.Booking, { foreignKey: 'EmployeeID' });
      Employee.hasMany(models.Package, { foreignKey: 'CreatedByEmployeeID', as: 'CreatedPackages' });
    }
  }

  Employee.init({
    employeeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'employeeId'
    },
    Name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: 'name'
    },
    Email: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      field: 'email'
    },
    Password: {
      type: DataTypes.CHAR(40),
      allowNull: false,
      field: 'password'
    },
    ContactNumber: {
      type: DataTypes.STRING(15),
      field: 'contactNumber'
    },
    IsManager: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'isManager'
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'isActive'
    }
  }, {
    sequelize,
    modelName: 'Employee',
    tableName: 'employee',
    timestamps: false,
  });

  return Employee;
};