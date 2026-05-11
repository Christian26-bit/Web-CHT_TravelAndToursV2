'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TripVehicle extends Model {
    static associate(models) {
      TripVehicle.belongsTo(models.Trip, { foreignKey: 'TripID' });
      TripVehicle.belongsTo(models.Vehicle, { foreignKey: 'VehicleID' });
    }
  }

  TripVehicle.init({
    TripVehicleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    TripID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'trip',
        key: 'TripID'
      }
    },
    VehicleID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'vehicle',
        key: 'VehicleID'
      }
    },
    DepartureLocation: DataTypes.STRING(100),
    ArrivalLocation: DataTypes.STRING(100),
    DepartureDateTime: DataTypes.DATE,
    ArrivalDateTime: DataTypes.DATE,
    SeatNumber: DataTypes.STRING(20),
    TicketReference: DataTypes.STRING(50),
    IsIncluded: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'TripVehicle',
    tableName: 'tripvehicles',
    timestamps: false,
  });

  return TripVehicle;
};