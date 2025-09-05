// Backend/router/profile-router.js
const express = require('express');
const router = express.Router();
const profileController = require('../controller/profile-controller');
const authMiddleware = require('../middleware/authMiddleware'); // Import the JWT authentication middleware
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs'); // Import fs module

// Multer storage configuration
// Requirement 8: Store in eRepo folder on the backend
const eRepoPath = process.env.EREPO_PATH || path.join(__dirname, '../../eRepo');
const storage = multer.diskStorage({
    // Dynamically create a sub-directory for each user
    destination: (req, file, cb) => {
        // Ensure authMiddleware has populated req.user
        if (!req.user || !req.user.userId) {
            return cb(new Error('User ID not available for file upload.'), null);
        }

        const userUploadsDir = path.join(eRepoPath, req.user.userId);
        
        // Check if the user's directory exists, and create it if it doesn't
        if (!fs.existsSync(userUploadsDir)) {
            fs.mkdirSync(userUploadsDir, { recursive: true });
        }
        cb(null, userUploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = crypto.randomBytes(16).toString('hex');
        const fileExtension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
    }
});

// Validation to only allow JPG, JPEG, and PNG files
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG, JPEG, and PNG image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
}).fields([
    { name: 'profile_photo', maxCount: 1 },
    { name: 'cover_photo', maxCount: 1 }
]);

// New DELETE route for immediate deletion
router.post('/delete-photo', authMiddleware, profileController.deleteProfilePhoto);

// Profile Routes
router.route('/:userId')
    .put(authMiddleware, upload, profileController.upsertProfile)
    .get(authMiddleware, profileController.getProfile);

module.exports = router;