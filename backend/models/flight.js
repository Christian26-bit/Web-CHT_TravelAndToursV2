"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Flight extends Model {
    static associate(models) {
      Flight.hasMany(models.ClientJourney, { foreignKey: "FlightId" });
    }
  }
  Flight.init(
    {
      FlightId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Airline: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "airline",
      },
      FlightNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: "flightNumber",
      },
      DepartureGate: {
        type: DataTypes.STRING(10),
        field: "departureGate",
      },
      ArrivalGate: {
        type: DataTypes.STRING(10),
        field: "arrivalGate",
      },
      Status: {
        type: DataTypes.ENUM(
          "ON TIME",
          "DELAYED",
          "CANCELLED",
          "IN AIR",
          "ARRIVED",
        ),
        defaultValue: "ON TIME",
        field: "status",
      },
      DepartureTime: {
        type: DataTypes.DATE,
        field: "departureTime",
      },
      ArrivalTime: {
        type: DataTypes.DATE,
        field: "arrivalTime",
      },
    },
    {
      sequelize,
      modelName: "Flight",
      tableName: "flights",
      timestamps: true,
    },
  );
  return Flight;
};
