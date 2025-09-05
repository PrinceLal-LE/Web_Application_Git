const express = require('express');
const authcontroller = require('../controller/auth-controller');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.route('/').get(authcontroller.home);


// Public Authentication Routes
router.post('/register', authcontroller.register);
router.post('/login', authcontroller.login);
router.post('/forgot-password-request', authcontroller.forgotPasswordRequest); // Request OTP for password reset
router.post('/reset-password-verify-otp', authcontroller.resetPasswordVerifyOtp); // Verify OTP for password reset
router.post('/reset-password', authcontroller.resetPassword); // Set new passwor
 
// NEW OTP related routes - These do NOT use authMiddleware as user is not yet logged in
router.post('/resend-otp', authcontroller.resendOTP); // Handles /api/auth/resend-otp
router.post('/verify-otp', authcontroller.verifyOTP);
// authenticated routes
router.route('/updateUser/:userId').put(authMiddleware, authcontroller.updateUser);
router.route('/getUserDetails/:userId').get(authMiddleware, authcontroller.getUserDetails);

module.exports = router;