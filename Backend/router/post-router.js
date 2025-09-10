// Backend/router/post-router.js
const express = require('express');
const router = express.Router();
const { createPost, getPostFeed, toggleLike, addComment, deletePost, softDeletePost, editComment, softDeleteComment } = require('../controller/post-controller');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const eRepoPath = process.env.EREPO_PATH || path.join(__dirname, '../../eRepo');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!req.user || !req.user.userId) {
            return cb(new Error('User ID not available for file upload.'), null);
        }
        const userUploadsDir = path.join(eRepoPath, req.user.userId);
        if (!fs.existsSync(userUploadsDir)) {
            fs.mkdirSync(userUploadsDir, { recursive: true });
        }
        cb(null, userUploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
    }
});

// File filter and limits for attachments
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG, JPEG, PNG, and PDF files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // Each file size max 2 MB
        files: 5, // Max 5 files
    }
}).fields([
    { name: 'images', maxCount: 5 },
    { name: 'video', maxCount: 1 },
    { name: 'attachments', maxCount: 5 }
]);

// Post Routes (protected by authMiddleware)
router.post('/create', authMiddleware, upload, createPost);
router.get('/feed', authMiddleware, getPostFeed);
router.delete('/:postId', authMiddleware, deletePost);
router.put('/:postId/delete', authMiddleware, softDeletePost);

// Interaction Routes
router.post('/:postId/like', authMiddleware, toggleLike);
router.post('/:postId/comment', authMiddleware, addComment);

// to edit and delete comment
router.put('/:postId/comment/:commentId/edit', authMiddleware, editComment);
router.put('/:postId/comment/:commentId/delete', authMiddleware, softDeleteComment);
module.exports = router;