const { Booking, Client, Package } = require("../models");
const { Op } = require("sequelize");

exports.getUserDashboard = async (req, res) => {
  try {
    const totalCustomers = await Client.count();

    const ongoingTrips = await Booking.count({
      where: { Status: "confirmed" },
    });
    const upcomingTrips = await Booking.count({ where: { Status: "pending" } });
    const completedTrips = await Booking.count({
      where: { Status: "cancelled" },
    });

    const recentBookings = await Booking.findAll({
      limit: 5,
      order: [["BookingID", "DESC"]],
      include: [{ model: Client }, { model: Package }],
    });

    const formattedBookings = recentBookings.map((b) => ({
      BookingID: b.BookingID,
      clientName: b.Client?.Name || "—",
      destination: b.Package?.Destination || "—",
      packageName: b.Package?.Name || "—",
      startDate: b.BookingDate,
      status: b.Status,
    }));

    res.json({
      success: true,
      data: {
        totalCustomers,
        ongoingTrips,
        upcomingTrips,
        completedTrips,
        recentBookings: formattedBookings,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};

exports.getBookingsList = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      order: [["BookingID", "DESC"]],
      include: [{ model: Client }, { model: Package }],
    });

    const formatted = bookings.map((b) => ({
      BookingID: b.BookingID,
      clientName: b.Client?.Name || "—",
      destination: b.Package?.Destination || "—",
      packageName: b.Package?.Name || "—",
      startDate: b.BookingDate,
      pax: b.PaxCount,
      status: b.Status,
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error("Bookings List Error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};
