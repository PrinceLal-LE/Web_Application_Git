// // Backend/router/post-router.js
// const express = require('express');
// const router = express.Router();
// const {postController,getPostFeed} = require('../controller/post-controller');
// const authMiddleware = require('../middleware/authMiddleware');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Multer storage configuration for posts
// const eRepoPath = process.env.EREPO_PATH || path.join(__dirname, '../../eRepo');
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         if (!req.user || !req.user.userId) {
//             return cb(new Error('User ID not available for file upload.'), null);
//         }
//         const userUploadsDir = path.join(eRepoPath, req.user.userId);
//         if (!fs.existsSync(userUploadsDir)) {
//             fs.mkdirSync(userUploadsDir, { recursive: true });
//         }
//         cb(null, userUploadsDir);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const fileExtension = path.extname(file.originalname);
//         cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
//     }
// });

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 50 * 1024 * 1024 }, // Max 50MB per file
// }).fields([
//     { name: 'images', maxCount: 5 }, // Allow up to 20 images
//     { name: 'video', maxCount: 1 }   // Allow 1 video
// ]);

// // Post Routes (protected by authMiddleware)
// router.post('/create', authMiddleware, upload, postController.createPost);
// router.get('/feed', authMiddleware, getPostFeed);
// router.delete('/:postId', authMiddleware, postController.deletePost);

// // Interaction Routes
// router.post('/:postId/like', authMiddleware, postController.toggleLike);
// router.post('/:postId/comment', authMiddleware, postController.addComment);

// module.exports = router;



// Backend/router/post-router.js
const express = require('express');
const router = express.Router();
// CRITICAL: Import functions directly from the controller module
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

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 },
}).fields([
    { name: 'images', maxCount: 5 },
    { name: 'video', maxCount: 1 }
]);

// Post Routes (protected by authMiddleware)
// CRITICAL: Use the imported function names directly
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