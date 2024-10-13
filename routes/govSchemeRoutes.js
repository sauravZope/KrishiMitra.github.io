const express = require('express');
const router = express.Router();
const govSchemeController = require('../controllers/govScheme');

router.get('/govScheme', govSchemeController.govSchemeControl);

module.exports = router;
