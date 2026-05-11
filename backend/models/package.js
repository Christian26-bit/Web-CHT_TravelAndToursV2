'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Package extends Model {
    static associate(models) {
      Package.belongsTo(models.Employee, { foreignKey: 'CreatedByEmployeeID', as: 'Creator' });
      Package.hasMany(models.Booking, { foreignKey: 'PackageID' });
      Package.belongsToMany(models.Trip, {
        through: models.PackageTrip,
        foreignKey: 'PackageID',
        otherKey: 'TripID'
      });
    }
  }

  Package.init({
    PackageID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Description: DataTypes.TEXT,
    Destination: DataTypes.STRING(100),
    Duration: DataTypes.INTEGER,
    MaxPax: DataTypes.INTEGER,
    Inclusions: DataTypes.TEXT,
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    CreatedByEmployeeID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'employee',
        key: 'employeeId'
      }
    }
  }, {
    sequelize,
    modelName: 'Package',
    tableName: 'package',
    timestamps: false,
  });

  return Package;
};