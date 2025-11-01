const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLogs');

// Get all activity logs \
router.get('/', async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(20);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity logs' });
  }
});

module.exports = router;
