const db = require("../models");
const {
  Booking,
  Client,
  Package,
  Employee,
  Payment,
  Trip,
  PackageTrip,
  Accommodation,
  TripAccommodation,
  Vehicle,
  TripVehicle,
  Activity,
  TripActivity,
} = db;
const { Op, fn, col } = require("sequelize");

exports.getDashboardSummary = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const totalCustomers = await Client.count();
    const ongoingTrips = await Trip.count({
      where: {
        StartDate: { [Op.lte]: today },
        EndDate: { [Op.gte]: today },
        IsActive: true,
      },
    });
    const upcomingTrips = await Trip.count({
      where: { StartDate: { [Op.gt]: today }, IsActive: true },
    });
    const completedTrips = await Trip.count({
      where: { EndDate: { [Op.lt]: today }, IsActive: true },
    });

    const recentBookings = await Booking.findAll({
      include: [
        { model: Client, attributes: ["Name"] },
        { model: Package, attributes: ["Name", "Destination"] },
      ],
      order: [["BookingID", "DESC"]],
      limit: 10,
    });

    res.json({
      success: true,
      data: {
        totalCustomers,
        ongoingTrips,
        upcomingTrips,
        completedTrips,
        recentBookings,
      },
    });
  } catch (err) {
    console.error("User dashboard error:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to load dashboard data" });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: Client, attributes: ["Name", "Email"] },
        { model: Package, attributes: ["Name", "Destination", "Price"] },
        { model: Employee, attributes: ["Name"] },
        { model: Payment },
      ],
      order: [["BookingID", "DESC"]],
    });
    res.json({ success: true, data: bookings });
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ success: false, error: "Failed to load bookings" });
  }
};

exports.saveBooking = async (req, res) => {
  try {
    const { clientId, packageId, startDate, numberOfPax, status } = req.body;

    if (!clientId || !packageId) {
      return res
        .status(400)
        .json({ success: false, error: "Client and Package are required" });
    }

    const booking = await Booking.create({
      EmployeeID: req.user.id,
      ClientID: clientId,
      PackageID: packageId,
      BookingDate: startDate || new Date(),
      Status: status || "Pending",
      PaxCount: numberOfPax || 1,
    });

    res.json({
      success: true,
      bookingId: booking.BookingID,
      bookingRef: `BK-${String(booking.BookingID).padStart(4, "0")}`,
      message: "Booking created successfully!",
    });
  } catch (err) {
    console.error("Save booking error:", err);
    res.status(500).json({ success: false, error: "Failed to save booking" });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId, packageId, startDate, numberOfPax, status } = req.body;

    await Booking.update(
      {
        ClientID: clientId,
        PackageID: packageId,
        BookingDate: startDate,
        PaxCount: numberOfPax,
        Status: status,
      },
      { where: { BookingID: id } },
    );

    res.json({ success: true, message: "Booking updated" });
  } catch (err) {
    console.error("Update booking error:", err);
    res.status(500).json({ success: false, error: "Failed to update booking" });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await Payment.destroy({ where: { BookingID: id } });
    await Booking.destroy({ where: { BookingID: id } });
    res.json({ success: true, message: "Booking deleted" });
  } catch (err) {
    console.error("Delete booking error:", err);
    res.status(500).json({ success: false, error: "Failed to delete booking" });
  }
};

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.findAll({ order: [["Name", "ASC"]] });
    res.json({ success: true, data: clients });
  } catch (err) {
    console.error("Get clients error:", err);
    res.status(500).json({ success: false, error: "Failed to load clients" });
  }
};

exports.saveClient = async (req, res) => {
  try {
    const { id, name, email, address, contactNumber, customerType } = req.body;

    if (id) {
      await Client.update(
        {
          Name: name,
          Email: email,
          Address: address,
          ContactNumber: contactNumber,
          CustomerType: customerType || "REGULAR",
        },
        { where: { clientId: id } },
      );
      res.json({ success: true, message: "Client updated" });
    } else {
      const client = await Client.create({
        Name: name,
        Email: email,
        Address: address,
        ContactNumber: contactNumber,
        CustomerType: customerType || "REGULAR",
        DateRegistered: new Date(),
      });
      res.json({
        success: true,
        message: "Client created",
        id: client.clientId,
      });
    }
  } catch (err) {
    console.error("Save client error:", err);
    if (err.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ success: false, error: "Email already exists" });
    }
    res.status(500).json({ success: false, error: "Failed to save client" });
  }
};

exports.getHotels = async (req, res) => {
  try {
    const hotels = await Accommodation.findAll({ order: [["Name", "ASC"]] });
    res.json({ success: true, data: hotels });
  } catch (err) {
    console.error("Get hotels error:", err);
    res.status(500).json({ success: false, error: "Failed to load hotels" });
  }
};

exports.getPackages = async (req, res) => {
  try {
    const packages = await Package.findAll({
      where: { IsActive: true },
      include: [
        {
          model: Trip,
          through: { attributes: ["Sequence", "DayOfPackage"] },
          include: [
            { model: TripActivity, include: [{ model: Activity }] },
            { model: TripAccommodation, include: [{ model: Accommodation }] },
            { model: TripVehicle, include: [{ model: Vehicle }] },
          ],
        },
      ],
      order: [["PackageID", "ASC"]],
    });
    res.json({ success: true, data: packages });
  } catch (err) {
    console.error("Get packages error:", err);
    res.status(500).json({ success: false, error: "Failed to load packages" });
  }
};

exports.getTourPackages = async (req, res) => {
  try {
    const packages = await Package.findAll({
      where: { IsActive: true },
      attributes: [
        "PackageID",
        "Name",
        "Description",
        "Destination",
        "Duration",
        "MaxPax",
        "Price",
        "Inclusions",
      ],
      order: [["Name", "ASC"]],
    });
    res.json({ success: true, data: packages });
  } catch (err) {
    console.error("Get tour packages error:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to load tour packages" });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Booking,
          include: [
            { model: Client, attributes: ["Name"] },
            { model: Package, attributes: ["Name"] },
          ],
        },
      ],
      order: [["paymentId", "DESC"]],
    });
    res.json({ success: true, data: payments });
  } catch (err) {
    console.error("Get payments error:", err);
    res.status(500).json({ success: false, error: "Failed to load payments" });
  }
};

exports.savePayment = async (req, res) => {
  try {
    const { bookingId, amount, paymentDate, method, status, referenceNumber } =
      req.body;

    const payment = await Payment.create({
      BookingID: bookingId,
      Amount: amount,
      PaymentDate: paymentDate || new Date(),
      Method: method,
      Status: status || "PENDING",
      ReferenceNumber: referenceNumber,
    });

    res.json({
      success: true,
      message: "Payment recorded",
      id: payment.paymentId,
    });
  } catch (err) {
    console.error("Save payment error:", err);
    res.status(500).json({ success: false, error: "Failed to save payment" });
  }
};

exports.getTransportation = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({ order: [["Type", "ASC"]] });
    res.json({ success: true, data: vehicles });
  } catch (err) {
    console.error("Get transportation error:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to load transportation" });
  }
};

exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      include: [
        { model: TripActivity, include: [{ model: Activity }] },
        { model: TripAccommodation, include: [{ model: Accommodation }] },
        { model: TripVehicle, include: [{ model: Vehicle }] },
      ],
      order: [["StartDate", "ASC"]],
    });
    res.json({ success: true, data: trips });
  } catch (err) {
    console.error("Get trips error:", err);
    res.status(500).json({ success: false, error: "Failed to load trips" });
  }
};

exports.getAddons = async (req, res) => {
  try {
    const activities = await Activity.findAll({
      where: { IsIncludedByDefault: false },
      order: [["Name", "ASC"]],
    });
    res.json({ success: true, data: activities });
  } catch (err) {
    console.error("Get addons error:", err);
    res.status(500).json({ success: false, error: "Failed to load addons" });
  }
};

exports.calculateCost = async (req, res) => {
  try {
    const { packageId, numberOfPax } = req.body;
    let totalAmount = 0;

    const pkg = await Package.findByPk(packageId);
    if (pkg) {
      totalAmount = parseFloat(pkg.Price) * (numberOfPax || 1);
    }

    res.json({
      success: true,
      data: {
        packagePrice: pkg ? parseFloat(pkg.Price) : 0,
        numberOfPax: numberOfPax || 1,
        totalAmount,
      },
    });
  } catch (err) {
    console.error("Calculate cost error:", err);
    res.status(500).json({ success: false, error: "Failed to calculate cost" });
  }
};
