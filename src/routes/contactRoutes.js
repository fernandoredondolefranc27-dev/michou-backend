const express = require('express');
const router = express.Router();
const { sendComplaint } = require('../controllers/contactController');

router.post('/complaint', sendComplaint);

module.exports = router;