const {
  Booking,
  Package,
  Client,
  Accommodation,
  Vehicle,
} = require("../models");

exports.calculateCost = async (req, res) => {
  try {
    const { packageId, pax = 1, accommodationId, vehicleId } = req.body;

    if (!packageId) {
      return res
        .status(400)
        .json({ success: false, error: "Package ID is required" });
    }

    const pkg = await Package.findByPk(packageId);
    if (!pkg) {
      return res
        .status(404)
        .json({ success: false, error: "Package not found" });
    }

    let total = 0;
    const breakdown = {};

    const pkgPrice = parseFloat(pkg.Price || 0);
    const pkgTotal = pkgPrice * pax;
    total += pkgTotal;
    breakdown.package = { unit: pkgPrice, count: pax, total: pkgTotal };

    if (accommodationId) {
      const hotel = await Accommodation.findByPk(accommodationId);
      if (hotel) {
        const hotelPrice = parseFloat(hotel.PricePerNight || 0);
        const duration = pkg.Duration || 1;
        const hotelTotal = hotelPrice * duration;
        total += hotelTotal;
        breakdown.hotel = {
          unit: hotelPrice,
          days: duration,
          total: hotelTotal,
        };
      }
    }

    if (vehicleId) {
      const vehicle = await Vehicle.findByPk(vehicleId);
      if (vehicle) {
        const transPrice = parseFloat(vehicle.PricePerDay || 0);
        const duration = pkg.Duration || 1;
        const transTotal = transPrice * duration;
        total += transTotal;
        breakdown.transport = {
          unit: transPrice,
          days: duration,
          total: transTotal,
        };
      }
    }

    res.json({
      success: true,
      total_cost: total,
      breakdown,
    });
  } catch (error) {
    console.error("Calculate Cost Error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};

exports.saveBooking = async (req, res) => {
  try {
    const {
      clientId,
      packageId,
      hotelId,
      transportId,
      pax,
      travelType,
      specialRequests,
      totalAmount,
      status,
    } = req.body;

    const booking = await Booking.create({
      ClientID: clientId,
      PackageID: packageId,
      EmployeeID: req.user.id,
      PaxCount: pax,
      BookingDate: new Date(),
      Status: status || "pending",
      // Add other fields if they exist in your model
    });

    res.json({
      success: true,
      message: "Booking saved successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Save Booking Error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};
