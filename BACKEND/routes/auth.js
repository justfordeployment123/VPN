const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  login2FA,
  verifyEmail, 
  forgotPassword, 
  resetPassword,
  generate2FA,
  verifyAndEnable2FA
} = require('../controllers/authController');
const { auth } = require('../middlewares/authMiddleware');

// @route   POST api/auth/register
router.post('/register', register);

// @route   POST api/auth/verify
router.post('/verify', verifyEmail);

// @route   POST api/auth/login
router.post('/login', login);

// @route   POST api/auth/login/2fa
router.post('/login/2fa', login2FA);

// @route   POST api/auth/2fa/setup
router.post('/2fa/setup', auth, generate2FA);

// @route   POST api/auth/2fa/verify
router.post('/2fa/verify', auth, verifyAndEnable2FA);

// @route   POST api/auth/forgotpassword
router.post('/forgotpassword', forgotPassword);

// @route   PUT api/auth/resetpassword/:resettoken
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
