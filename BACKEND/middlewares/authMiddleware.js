const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  
  const token = req.header('x-auth-token');

  
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

const admin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ msg: 'Access denied: Administrative privileges required' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error during role verification' });
  }
};

module.exports = { auth, admin };
