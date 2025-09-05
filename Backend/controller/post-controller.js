// Backend/controller/post-controller.js
const Post = require('../models/post-model');
const path = require('path');
const fs = require('fs');
const User = require('../models/users-model'); // Import User model
const Profile = require('../models/profile-model'); // Import Profile model

// Get eRepo path from .env
const eRepoPath = process.env.EREPO_PATH || path.join(__dirname, '../../eRepo');

// Helper function for deleting files (reusing from profile-controller)
const deleteFile = (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
            console.log(`[File Deletion] Successfully deleted file: ${filePath}`);
            return true;
        } catch (err) {
            console.error(`[File Deletion] Error deleting file ${filePath}:`, err);
            return false;
        }
    }
    return true;
};

// --- POST /api/posts/create ---
const createPost = async (req, res) => {
    try {
        const { content, data } = req.body;
        const authenticatedUserId = req.userId; // From authMiddleware

        if (!content) {
            return res.status(400).json({ message: 'Post content is required.' });
        }

        const postData = {
            user: authenticatedUserId,
            content,
        };
        if (data) {
            try {
                postData.data = JSON.parse(data);
            } catch (e) {
                console.error('Error parsing data JSON:', e);
                return res.status(400).json({ message: 'Invalid format for data options.' });
            }
        }

        // Handle file uploads from multer
        if (req.files) {
            const images = req.files.images;
            const video = req.files.video ? req.files.video[0] : null;
            const userUserId = req.user.userId;

            if (images) {
                const imageDetails = images.map(file => ({
                    filename: file.filename,
                    filepath: path.join(userUserId, file.filename),
                }));
                postData.images = imageDetails;
            }

            if (video) {
                postData.video = {
                    filename: video.filename,
                    filepath: path.join(userUserId, video.filename),
                };
            }
        }

        const newPost = new Post(postData);
        await newPost.save();

        // Populate user data for the response
        await newPost.populate('user', 'name userId profile_photo_filepath');

        res.status(201).json({ message: 'Post created successfully.', post: newPost });

    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server error creating post.', error: error.message });
    }
};

// --- GET /api/posts/feed ---
const getPostFeed = async (req, res) => {
    try {
        const posts = await Post.find({ is_deleted: { $ne: 1 } })
            .sort({ createdAt: -1 })
            .populate('user', 'name userId')
            .populate('comments.user', 'name userId');

        const allUserIds = new Set();
        posts.forEach(post => {
            allUserIds.add(post.user._id.toString());
            post.comments.forEach(comment => {
                allUserIds.add(comment.user._id.toString());
            });
        });

        const profiles = await Profile.find({ user_id: { $in: [...allUserIds] } }).select('user_id profile_photo_filepath');

        const profilePicMap = new Map();
        profiles.forEach(profile => {
            if (profile.profile_photo_filepath) {
                profilePicMap.set(profile.user_id.toString(), profile.profile_photo_filepath);
            }
        });

        const postsWithProfileData = posts.map(post => {
            const postObject = post.toObject();
            const postAuthorId = postObject.user._id.toString();
            postObject.user.profile_photo_filepath = profilePicMap.get(postAuthorId);
            postObject.comments = postObject.comments.filter(comment => comment.is_deleted === 0 && comment.is_deleted_by_admin !== 1)

            postObject.comments.forEach(comment => {
                const commentAuthorId = comment.user._id.toString();
                comment.user.profile_photo_filepath = profilePicMap.get(commentAuthorId);
            });
            return postObject;
        });

        res.status(200).json({ message: 'Posts fetched successfully.', posts: postsWithProfileData });

    } catch (error) {
        console.error('Error fetching post feed:', error);
        res.status(500).json({ message: 'Server error fetching posts.', error: error.message });
    }
};
// --- POST /api/posts/:postId/like ---
const toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const authenticatedUserId = req.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        const userLikedPost = post.likes.includes(authenticatedUserId);
        if (userLikedPost) {
            post.likes = post.likes.filter(id => id.toString() !== authenticatedUserId.toString());
        } else {
            post.likes.push(authenticatedUserId);
        }
        await post.save();
        res.status(200).json({
            message: userLikedPost ? 'Post unliked successfully.' : 'Post liked successfully.',
            post
        });
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ message: 'Server error toggling like.', error: error.message });
    }
};

// --- POST /api/posts/:postId/comment ---
const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;
        const authenticatedUserId = req.userId;

        if (!text) {
            return res.status(400).json({ message: 'Comment text is required.' });
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        post.comments.push({
            user: authenticatedUserId,
            text,
        });
        await post.save();
        const newComment = post.comments[post.comments.length - 1];
        await Post.populate(newComment, { path: 'user', select: 'name userId profile_photo_filepath' });
        res.status(201).json({ message: 'Comment added successfully.', comment: newComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server error adding comment.', error: error.message });
    }
};

// --- DELETE /api/posts/:postId ---
const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const authenticatedUserId = req.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        if (post.user.toString() !== authenticatedUserId.toString()) {
            return res.status(403).json({ message: 'Forbidden: You can only delete your own posts.' });
        }
        if (post.images && post.images.length > 0) {
            post.images.forEach(img => {
                const filePath = path.join(eRepoPath, img.filepath);
                deleteFile(filePath);
            });
        }
        if (post.video) {
            const filePath = path.join(eRepoPath, post.video.filepath);
            deleteFile(filePath);
        }
        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server error deleting post.', error: error.message });
    }
};

// 
const softDeletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const authenticatedUserId = req.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        if (post.user.toString() !== authenticatedUserId.toString()) {
            return res.status(403).json({ message: 'Forbidden: You can only delete your own posts.' });
        }
        post.is_deleted = 1;
        await post.save();
        res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server error deleting post.', error: error.message });
    }
};

// To edit the comment
const editComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const { text } = req.body;
        const authenticatedUserId = req.userId;

        if (!text || text.length > 250) {
            return res.status(400).json({ message: 'Comment text is required and must be under 250 characters.' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }
        if (comment.user.toString() !== authenticatedUserId.toString()) {
            return res.status(403).json({ message: 'Forbidden: You can only edit your own comments.' });
        }
        comment.text = text;
        await post.save();
        res.status(200).json({ message: 'Comment edited successfully.', comment });
    } catch (error) {
        console.error('Error editing comment:', error);
        res.status(500).json({ message: 'Server error editing comment.', error: error.message });
    }
};

// Soft delete comment
const softDeleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const authenticatedUserId = req.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }
        if (comment.user.toString() !== authenticatedUserId.toString()) {
            return res.status(403).json({ message: 'Forbidden: You can only delete your own comments.' });
        }
        comment.is_deleted = 1;
        await post.save();
        res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Server error deleting comment.', error: error.message });
    }
};

// CRITICAL: Export the functions directly inside an object
module.exports = {
    createPost,
    getPostFeed,
    toggleLike,
    addComment,
    deletePost,
    softDeletePost,
    editComment,
    softDeleteComment
};
