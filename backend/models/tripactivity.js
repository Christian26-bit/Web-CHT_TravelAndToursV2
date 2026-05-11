'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TripActivity extends Model {
    static associate(models) {
      TripActivity.belongsTo(models.Trip, { foreignKey: 'TripID' });
      TripActivity.belongsTo(models.Activity, { foreignKey: 'ActivityID' });
    }
  }

  TripActivity.init({
    TripActivityID: {
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
    ActivityID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'activity',
        key: 'activityId'
      }
    },
    Location: DataTypes.STRING(105),
    StartDateTime: DataTypes.DATE,
    EndDateTime: DataTypes.DATE,
    GuideName: DataTypes.STRING(50),
    EquipmentProvided: DataTypes.STRING(105),
    IsIncluded: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'TripActivity',
    tableName: 'tripsactivities',
    timestamps: false,
  });

  return TripActivity;
};