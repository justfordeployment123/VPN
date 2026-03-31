const express = require('express');
const router = express.Router();
const { connectNode, disconnectNode } = require('../controllers/vpnController');
const { auth } = require('../middlewares/authMiddleware');




router.post('/connect', auth, connectNode);




router.post('/disconnect', auth, disconnectNode);

module.exports = router;
