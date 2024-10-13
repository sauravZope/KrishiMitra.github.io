const express = require("express");
const { GeminiApiCall } = require("../controllers/GeminiApiCall");
const router = express.Router();

router.use('/location-crop-predict', GeminiApiCall);

module.exports = router;
