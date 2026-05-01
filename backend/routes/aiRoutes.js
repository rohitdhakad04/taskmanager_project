// backend/routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const { generateTaskDetails } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/generate-task', protect, generateTaskDetails);

module.exports = router;
