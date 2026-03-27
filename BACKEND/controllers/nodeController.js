const Node = require('../models/Node');

// @desc    Get all active nodes
exports.getNodes = async (req, res) => {
  try {
    const nodes = await Node.find({ isActive: true }).select('-publicKey');
    res.json(nodes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
