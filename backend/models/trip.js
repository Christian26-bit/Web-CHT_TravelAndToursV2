'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    static associate(models) {
      Trip.belongsToMany(models.Package, {
        through: models.PackageTrip,
        foreignKey: 'TripID',
        otherKey: 'PackageID'
      });
      Trip.hasMany(models.TripActivity, { foreignKey: 'TripID' });
      Trip.hasMany(models.TripVehicle, { foreignKey: 'TripID' });
      Trip.hasMany(models.TripAccommodation, { foreignKey: 'TripID' });
    }
  }

  Trip.init({
    TripID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    Description: DataTypes.TEXT,
    Location: DataTypes.STRING(100),
    StartDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    EndDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  }, {
    sequelize,
    modelName: 'Trip',
    tableName: 'trip',
    timestamps: false,
  });

  return Trip;
};