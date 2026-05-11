'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TripAccommodation extends Model {
    static associate(models) {
      TripAccommodation.belongsTo(models.Trip, { foreignKey: 'TripID' });
      TripAccommodation.belongsTo(models.Accommodation, { foreignKey: 'AccommodationID' });
    }
  }

  TripAccommodation.init({
    TripAccommodationID: {
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
    AccommodationID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'accommodation',
        key: 'accommodationId'
      }
    },
    CheckInDate: DataTypes.DATE,
    CheckOutDate: DataTypes.DATE,
    RoomType: DataTypes.STRING(50),
    IsIncluded: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'TripAccommodation',
    tableName: 'tripaccomodations',
    timestamps: false,
  });

  return TripAccommodation;
};