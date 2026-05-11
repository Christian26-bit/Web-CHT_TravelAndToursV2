'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    static associate(models) {
      Activity.hasMany(models.TripActivity, { foreignKey: 'ActivityID' });
    }
  }

  Activity.init({
    activityId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'activityId'
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'name'
    },
    Description: {
      type: DataTypes.TEXT,
      field: 'description'
    },
    DefaultLocation: {
      type: DataTypes.STRING(50),
      field: 'defaultLocation'
    },
    DefaultDuration: {
      type: DataTypes.INTEGER,
      field: 'defaultDuration'
    },
    IsIncludedByDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'isIncludedByDefault'
    }
  }, {
    sequelize,
    modelName: 'Activity',
    tableName: 'activity',
    timestamps: false,
  });

  return Activity;
};