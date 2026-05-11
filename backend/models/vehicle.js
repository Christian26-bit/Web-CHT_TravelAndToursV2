'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    static associate(models) {
      Vehicle.hasMany(models.TripVehicle, { foreignKey: 'VehicleID' });
    }
  }

  Vehicle.init({
    VehicleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Capacity: DataTypes.INTEGER,
    PlateNumber: DataTypes.STRING(10),
    ProviderName: DataTypes.STRING(100),
  }, {
    sequelize,
    modelName: 'Vehicle',
    tableName: 'vehicle',
    timestamps: false,
  });

  return Vehicle;
};