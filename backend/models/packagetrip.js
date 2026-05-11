'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PackageTrip extends Model {
    static associate(models) {
      PackageTrip.belongsTo(models.Package, { foreignKey: 'PackageID' });
      PackageTrip.belongsTo(models.Trip, { foreignKey: 'TripID' });
    }
  }

  PackageTrip.init({
    PackageTripID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    PackageID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'package',
        key: 'PackageID'
      }
    },
    TripID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'trip',
        key: 'TripID'
      }
    },
    Sequence: DataTypes.INTEGER,
    DayOfPackage: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'PackageTrip',
    tableName: 'packagetrips',
    timestamps: false,
  });

  return PackageTrip;
};