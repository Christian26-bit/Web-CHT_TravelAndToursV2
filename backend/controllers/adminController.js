const db = require("../models");
const bcrypt = require("bcryptjs");
const {
  Employee,
  Booking,
  Package,
  Client,
  Payment,
  Accommodation,
  Vehicle,
  Trip,
} = db;
const { Op, fn, col, literal } = require("sequelize");
exports.getDashboardSummary = async (req, res) => {
  try {
    const totalBookings = await Booking.count();
    const totalClients = await Client.count();
    const totalPackages = await Package.count({ where: { IsActive: true } });

    const revenueResult = await Payment.findOne({
      attributes: [
        [fn("COALESCE", fn("SUM", col("Amount")), 0), "totalRevenue"],
      ],
      where: { Status: "PAID" },
      raw: true,
    });

    const recentBookings = await Booking.findAll({
      include: [
        { model: Client, attributes: ["Name", "Email"] },
        { model: Package, attributes: ["Name", "Destination"] },
        { model: Employee, attributes: ["Name"] },
      ],
      order: [["BookingID", "DESC"]],
      limit: 5,
    });

    const topEmployees = await Employee.findAll({
      attributes: [
        "Name",
        [fn("COUNT", col("Bookings.BookingID")), "bookingCount"],
      ],
      include: [
        {
          model: Booking,
          attributes: [],
        },
      ],
      where: { IsActive: true },
      group: ["Employee.employeeId", "Employee.Name"],
      order: [[literal("bookingCount"), "DESC"]],
      limit: 5,
      subQuery: false,
    });

    res.json({
      success: true,
      data: {
        totalBookings,
        totalClients,
        totalEmployees,
        totalPackages,
        totalRevenue: parseFloat(revenueResult?.totalRevenue || 0),
        recentBookings,
        topEmployees,
      },
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to load dashboard data" });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const { search } = req.query;
    let where = {};
    if (search) {
      where = {
        [Op.or]: [
          { Name: { [Op.like]: `%${search}%` } },
          { Email: { [Op.like]: `%${search}%` } },
        ],
      };
    }
    const employees = await Employee.findAll({
      where,
      attributes: { exclude: ["Password"] },
      order: [["Name", "ASC"]],
    });
    res.json({ success: true, data: employees });
  } catch (err) {
    console.error("Get employees error:", err);
    res.status(500).json({ success: false, error: "Failed to load employees" });
  }
};

exports.saveEmployee = async (req, res) => {
  try {
    const { id, name, email, password, contactNumber, isManager, isActive } =
      req.body;

    if (id) {
      const updateData = {
        Name: name,
        Email: email,
        ContactNumber: contactNumber || null,
        IsManager: isManager ? true : false,
        IsActive: isActive !== undefined ? isActive : true,
      };
      if (password) {
        updateData.Password = await bcrypt.hash(password, 10);
      }
      await Employee.update(updateData, { where: { employeeId: id } });
      res.json({ success: true, message: "Employee updated" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const employee = await Employee.create({
        Name: name,
        Email: email,
        Password: hashedPassword,
        ContactNumber: contactNumber || null,
        IsManager: isManager ? true : false,
        IsActive: isActive !== undefined ? isActive : true,
      });
      res.json({
        success: true,
        message: "Employee created",
        id: employee.employeeId,
      });
    }
  } catch (err) {
    console.error("Save employee error:", err);
    if (err.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ success: false, error: "Email already exists" });
    }
    res.status(500).json({ success: false, error: "Failed to save employee" });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const hasBookings = await Booking.count({ where: { EmployeeID: id } });
    if (hasBookings > 0) {
      return res.status(400).json({
        success: false,
        error:
          "Cannot delete employee with existing bookings. Deactivate instead.",
      });
    }
    await Employee.destroy({ where: { employeeId: id } });
    res.json({ success: true, message: "Employee deleted" });
  } catch (err) {
    console.error("Delete employee error:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to delete employee" });
  }
};

exports.toggleEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    await Employee.update(
      { IsActive: isActive },
      { where: { employeeId: id } },
    );
    res.json({
      success: true,
      message: `Employee ${isActive ? "activated" : "deactivated"}`,
    });
  } catch (err) {
    console.error("Toggle employee error:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to toggle employee status" });
  }
};

exports.getPackages = async (req, res) => {
  try {
    const packages = await Package.findAll({
      include: [{ model: Employee, as: "Creator", attributes: ["Name"] }],
      order: [["PackageID", "DESC"]],
    });
    res.json({ success: true, data: packages });
  } catch (err) {
    console.error("Get packages error:", err);
    res.status(500).json({ success: false, error: "Failed to load packages" });
  }
};

exports.savePackage = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      destination,
      duration,
      maxPax,
      inclusions,
      price,
      isActive,
    } = req.body;

    if (id) {
      await Package.update(
        {
          Name: name,
          Description: description,
          Destination: destination,
          Duration: duration,
          MaxPax: maxPax,
          Inclusions: inclusions,
          Price: price,
          IsActive: isActive !== undefined ? isActive : true,
        },
        { where: { PackageID: id } },
      );
      res.json({ success: true, message: "Package updated" });
    } else {
      const pkg = await Package.create({
        Name: name,
        Description: description,
        Destination: destination,
        Duration: duration,
        MaxPax: maxPax,
        Inclusions: inclusions,
        Price: price,
        IsActive: isActive !== undefined ? isActive : true,
        CreatedByEmployeeID: req.user.id,
      });
      res.json({
        success: true,
        message: "Package created",
        id: pkg.PackageID,
      });
    }
  } catch (err) {
    console.error("Save package error:", err);
    res.status(500).json({ success: false, error: "Failed to save package" });
  }
};

exports.deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const hasBookings = await Booking.count({ where: { PackageID: id } });
    if (hasBookings > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete package with existing bookings",
      });
    }
    await Package.destroy({ where: { PackageID: id } });
    res.json({ success: true, message: "Package deleted" });
  } catch (err) {
    console.error("Delete package error:", err);
    res.status(500).json({ success: false, error: "Failed to delete package" });
  }
};

exports.getAccommodations = async (req, res) => {
  try {
    const data = await Accommodation.findAll({ order: [["name", "ASC"]] });
    res.json({ success: true, data });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Failed to load accommodations" });
  }
};

exports.saveAccommodation = async (req, res) => {
  try {
    const {
      id,
      name,
      address,
      contact,
      amenities,
      numberOfRooms,
      defaultRoomType,
    } = req.body;
    if (id) {
      await Accommodation.update(
        { name, address, contact, amenities, numberOfRooms, defaultRoomType },
        { where: { accommodationId: id } },
      );
    } else {
      await Accommodation.create({
        name,
        address,
        contact,
        amenities,
        numberOfRooms,
        defaultRoomType,
      });
    }
    res.json({ success: true, message: "Accommodation saved" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Failed to save accommodation" });
  }
};

exports.deleteAccommodation = async (req, res) => {
  try {
    await Accommodation.destroy({ where: { accommodationId: req.params.id } });
    res.json({ success: true, message: "Accommodation deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Failed to delete accommodation" });
  }
};

exports.getVehicles = async (req, res) => {
  try {
    const data = await Vehicle.findAll({ order: [["Type", "ASC"]] });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to load vehicles" });
  }
};

exports.saveVehicle = async (req, res) => {
  try {
    const { id, Type, Capacity, PlateNumber, ProviderName } = req.body;
    if (id) {
      await Vehicle.update(
        { Type, Capacity, PlateNumber, ProviderName },
        { where: { VehicleID: id } },
      );
    } else {
      await Vehicle.create({ Type, Capacity, PlateNumber, ProviderName });
    }
    res.json({ success: true, message: "Vehicle saved" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to save vehicle" });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    await Vehicle.destroy({ where: { VehicleID: req.params.id } });
    res.json({ success: true, message: "Vehicle deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to delete vehicle" });
  }
};

exports.getTrips = async (req, res) => {
  try {
    const data = await Trip.findAll({ order: [["TripID", "DESC"]] });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to load trips" });
  }
};

exports.saveTrip = async (req, res) => {
  try {
    const { id, Name, Description, Location, StartDate, EndDate, IsActive } =
      req.body;
    if (id) {
      await Trip.update(
        { Name, Description, Location, StartDate, EndDate, IsActive },
        { where: { TripID: id } },
      );
    } else {
      await Trip.create({
        Name,
        Description,
        Location,
        StartDate,
        EndDate,
        IsActive: IsActive !== undefined ? IsActive : true,
      });
    }
    res.json({ success: true, message: "Trip saved" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to save trip" });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    await Trip.destroy({ where: { TripID: req.params.id } });
    res.json({ success: true, message: "Trip deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to delete trip" });
  }
};
