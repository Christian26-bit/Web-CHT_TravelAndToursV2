const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/DashboardController');
const clientController = require('../controllers/ClientController');
const packageController = require('../controllers/PackageController');
const resourceController = require('../controllers/ResourceController');
const bookingController = require('../controllers/BookingController');
const verifyToken = require('../middleware/verifyToken');

router.get('/user_dashboard_summary', verifyToken, dashboardController.getUserDashboard);
router.get('/bookings_list', verifyToken, dashboardController.getBookingsList);
router.get('/clients_list', verifyToken, clientController.listClients);
router.get('/clients', verifyToken, clientController.listClients);
router.get('/packages_list', verifyToken, packageController.listPackages);
router.get('/tour_packages_list', verifyToken, packageController.listPackages);
router.post('/clients_save', verifyToken, clientController.saveClient);


router.get('/hotels_list', verifyToken, resourceController.listHotels);
router.get('/transportation_list', verifyToken, resourceController.listTransportation);
router.get('/trips_list', verifyToken, resourceController.listTrips);
router.post('/calculate_cost', verifyToken, bookingController.calculateCost);
router.post('/bookings', verifyToken, bookingController.saveBooking);

module.exports = router;
