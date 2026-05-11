const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

router.post('/login', authController.login);
router.post('/logout', (req, res) => res.json({ success: true }));

module.exports = router;
