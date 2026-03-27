const express = require('express');
const router = express.Router();
const { getNodes } = require('../controllers/nodeController');

// @route   GET api/nodes
// @desc    Get all active VPN nodes
// @access  Public (or Protected)
router.get('/', getNodes);

module.exports = router;
