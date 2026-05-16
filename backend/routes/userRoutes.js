const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/DashboardController");
const clientController = require("../controllers/ClientController");
const packageController = require("../controllers/PackageController");
const resourceController = require("../controllers/ResourceController");
const bookingController = require("../controllers/BookingController");
const journeyController = require("../controllers/JourneyController");
const paymentController = require("../controllers/PaymentController");
const verifyToken = require("../middleware/verifyToken");

router.get(
  "/user_dashboard_summary",
  verifyToken,
  dashboardController.getUserDashboard,
);
router.get("/bookings_list", verifyToken, dashboardController.getBookingsList);
router.get("/clients", verifyToken, clientController.listClients);
router.get("/packages", verifyToken, packageController.listPackages);
router.get("/tour-packages", verifyToken, packageController.listPackages);
router.post("/clients_save", verifyToken, clientController.saveClient);

router.get("/hotels", verifyToken, resourceController.listHotels);
router.get(
  "/transportation",
  verifyToken,
  resourceController.listTransportation,
);
router.get("/trips", verifyToken, resourceController.listTrips);
router.post("/calculate_cost", verifyToken, bookingController.calculateCost);
router.post("/bookings", verifyToken, bookingController.saveBooking);

router.get("/flights", verifyToken, resourceController.listFlights);

router.get("/journeys", verifyToken, journeyController.getClientJourneys);
router.post(
  "/journeys/update",
  verifyToken,
  journeyController.updateJourneyMilestone,
);

router.get("/payments", verifyToken, paymentController.listPayments);
router.post("/payments", verifyToken, paymentController.savePayment);

module.exports = router;
