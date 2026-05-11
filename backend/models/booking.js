'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.Employee, { foreignKey: 'EmployeeID' });
      Booking.belongsTo(models.Client, { foreignKey: 'ClientID' });
      Booking.belongsTo(models.Package, { foreignKey: 'PackageID' });
      Booking.hasMany(models.Payment, { foreignKey: 'BookingID' });
    }
  }

  Booking.init({
    BookingID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    EmployeeID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'employee',
        key: 'employeeId'
      }
    },
    ClientID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'client',
        key: 'clientId'
      }
    },
    PackageID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'package',
        key: 'PackageID'
      }
    },
    BookingDate: DataTypes.DATE,
    Status: DataTypes.STRING(50),
    PaxCount: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Booking',
    tableName: 'booking',
    timestamps: false,
  });

  return Booking;
};