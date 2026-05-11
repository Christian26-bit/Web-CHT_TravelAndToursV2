'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Accommodation extends Model {
    static associate(models) {
      Accommodation.hasMany(models.TripAccommodation, { foreignKey: 'AccommodationID' });
    }
  }

  Accommodation.init({
    accommodationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'accommodationId'
    },
    Name: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: 'name'
    },
    Address: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'address'
    },
    Contact: {
      type: DataTypes.STRING(50),
      field: 'contact'
    },
    Amenities: {
      type: DataTypes.TEXT,
      field: 'amenities'
    },
    NumberOfRooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'numberOfRooms'
    },
    DefaultRoomType: {
      type: DataTypes.STRING(30),
      field: 'defaultRoomType'
    }
  }, {
    sequelize,
    modelName: 'Accommodation',
    tableName: 'accommodation',
    timestamps: false,
  });

  return Accommodation;
};