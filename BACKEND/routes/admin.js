const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middlewares/authMiddleware');
const User = require('../models/User');
const Node = require('../models/Node');




router.get('/me', [auth, admin], async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching profile' });
  }
});




router.get('/stats', [auth, admin], async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const premiumUsers = await User.countDocuments({ tier: 'premium' });
    const freeUsers = await User.countDocuments({ tier: 'free' });
    const activeNodes = await Node.countDocuments({ isActive: true });
    
    
    res.json({
      totalUsers,
      premiumUsers,
      freeUsers,
      activeNodes,
      growth: {
        users: '+12%',
        tunnels: '+4.3%',
        load: '-2%'
      },
      systemStatus: 'Online'
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching metrics' });
  }
});




router.get('/users', [auth, admin], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching users' });
  }
});

// @route   POST api/admin/users


router.post('/users', [auth, admin], async (req, res) => {
  try {
    const { email, password, role, tier, isVerified } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ email, password, role, tier, isVerified });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error creating user' });
  }
});




router.put('/users/:id', [auth, admin], async (req, res) => {
  try {
    const { email, role, tier, expiryDate, isVerified, password } = req.body;
    const userFields = { email, role, tier, expiryDate, isVerified };
    
    if (password) {
      const salt = await require('bcryptjs').genSalt(10);
      userFields.password = await require('bcryptjs').hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error updating user' });
  }
});




router.delete('/users/:id', [auth, admin], async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User removed successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error deleting user' });
  }
});




router.post('/nodes', [auth, admin], async (req, res) => {
  try {
    const newNode = new Node(req.body);
    await newNode.save();
    res.json(newNode);
  } catch (err) {
    res.status(500).json({ msg: 'Error creating node' });
  }
});




router.put('/nodes/:id', [auth, admin], async (req, res) => {
  try {
    const node = await Node.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(node);
  } catch (err) {
    res.status(500).json({ msg: 'Error updating node' });
  }
});

module.exports = router;
