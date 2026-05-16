'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClientJourney extends Model {
    static associate(models) {
      ClientJourney.belongsTo(models.Booking, { foreignKey: 'BookingID' });
      ClientJourney.belongsTo(models.Flight, { foreignKey: 'FlightId' });
    }
  }
  ClientJourney.init({
    JourneyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    BookingID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'bookingId'
    },
    FlightId: {
      type: DataTypes.INTEGER,
      field: 'flightId'
    },
    Title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'title'
    },
    Description: {
      type: DataTypes.STRING(255),
      field: 'description'
    },
    Status: {
      type: DataTypes.STRING(50),
      field: 'status'
    },
    Timestamp: {
      type: DataTypes.DATE,
      field: 'timestamp'
    },
    IsCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'isCompleted'
    }
  }, {
    sequelize,
    modelName: 'ClientJourney',
    tableName: 'client_journeys',
    timestamps: true,
  });
  return ClientJourney;
};