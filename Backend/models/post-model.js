// Backend/models/post-model.js
const mongoose = require('mongoose');
const User = require('./users-model'); // CRITICAL: Explicitly import the User model to ensure it's registered first

// Schema for embedded comments
const commentSchema = new mongoose.Schema({
    user: { // Reference to the user who made the comment
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This must match the name in mongoose.model() in users-model.js
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 250 
    },
    likes: [{ // Array of users who liked this comment
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    is_deleted: { // For soft deletion by user (Requirement 1.1)
        type: Number,
        default: 0,
    },
    is_deleted_by_admin: { // For soft deletion by admin (Requirement 1.4)
        type: Number,
        default: 0,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt for comments
});

// Main Post Schema
const postSchema = new mongoose.Schema({
    user: { // Reference to the user who created the post
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This must match the name in mongoose.model() in users-model.js
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
    },
    images: [{
        filename: { type: String },
        filepath: { type: String },
    }],
    video: {
        filename: { type: String },
        filepath: { type: String },
    },
    data: [{
        id: { type: String },
        name: { type: String }
    }],
    likes: [{ // Array of users who liked this post
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [commentSchema], // Embedded comments schema
    shareCount: {
        type: Number,
        default: 0,
    },
    repostCount: {
        type: Number,
        default: 0,
    },
    is_deleted: { // For soft deletion by user (Requirement 2.1)
        type: Number,
        default: 0,
    },
    is_deleted_by_admin: { // For soft deletion by admin (Requirement 2.4)
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;