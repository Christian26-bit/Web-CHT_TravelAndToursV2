const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const adminOnly = require("../middleware/adminOnly");
const adminController = require("../controllers/adminController");

router.use(verifyToken);
router.use(adminOnly);

router.get("/dashboard-summary", adminController.getDashboardSummary);

router.get("/employees", adminController.getEmployees);
router.post("/employees", adminController.saveEmployee);
router.delete("/employees/:id", adminController.deleteEmployee);
router.patch("/employees/:id/toggle", adminController.toggleEmployee);

router.get("/packages", adminController.getPackages);
router.post("/packages", adminController.savePackage);
router.delete("/packages/:id", adminController.deletePackage);
router.get("/accommodations", adminController.getAccommodations);
router.post("/accommodations", adminController.saveAccommodation);
router.delete("/accommodations/:id", adminController.deleteAccommodation);

router.get("/vehicles", adminController.getVehicles);
router.post("/vehicles", adminController.saveVehicle);
router.delete("/vehicles/:id", adminController.deleteVehicle);

router.get("/trips", adminController.getTrips);
router.post("/trips", adminController.saveTrip);
router.delete("/trips/:id", adminController.deleteTrip);

router.patch("/clients/:id/manager", adminController.updateClientManager);
router.delete("/clients/:id", adminController.deleteClient);

module.exports = router;
