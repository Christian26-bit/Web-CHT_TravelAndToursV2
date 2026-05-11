const { Accommodation, Vehicle, Trip, Package } = require("../models");

exports.listHotels = async (req, res) => {
  try {
    const hotels = await Accommodation.findAll();
    res.json({ success: true, data: hotels });
  } catch (error) {
    console.error("List Hotels Error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};

exports.listTransportation = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.json({ success: true, data: vehicles });
  } catch (error) {
    console.error("List Transport Error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};

exports.listTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({ where: { IsActive: true } });
    res.json({ success: true, data: trips });
  } catch (error) {
    console.error("List Trips Error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};
