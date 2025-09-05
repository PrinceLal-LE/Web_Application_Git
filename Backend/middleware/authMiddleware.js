// Backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/users-model'); // Assuming your User model is here

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const jwtToken = token.replace('Bearer', '').trim();
    try {
        const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

        // Find the user based on the decoded token's ID (assuming your JWT payload contains userId)
        // Adjust 'User' and field names based on your actual user model
        const userData = await User.findOne({ _id: isVerified.userId }).select({ password: 0 });

        if (!userData) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        // Attach user data to the request object for use in controllers
        req.user = userData; // Contains user_id, email, etc.
        req.token = token;
        req.userId = userData._id;

        next(); // Proceed to the next middleware/controller
    } catch (error) {
        console.error('JWT Verification Error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Unauthorized: Token expired' });
        }
        return res.status(401).json({ message: 'Unauthorized: Invalid tokeng' });
    }
};

module.exports = authMiddleware;