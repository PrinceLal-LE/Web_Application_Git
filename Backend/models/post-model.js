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

const contactDetailsSchema = new mongoose.Schema({
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    company: { type: String, trim: true, default: null },
    mobile: { type: String, trim: true, default: null },
    email: { type: String, trim: true, default: null },
});

// Main Post Schema
const postSchema = new mongoose.Schema({
    user: { // Reference to the user who created the post
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This must match the name in mongoose.model() in users-model.js
        required: true,
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

    // Form data to collect information form the users.
    main_option: { type: String, trim: true, required: true },
    sub_option: { type: String, trim: true, required: true },
    suboption_other: { type: String, trim: true, maxlength: 25, default: null },
    title: { type: String, trim: true, required: true },
    description: { type: String, trim: true, default: null, maxlength: 2000 },
    location: { type: String, trim: true, default: null },
    contact_details: contactDetailsSchema,
    can_mould_connect: { type: String, enum: ['Yes', 'No'], default: 'No' },
    attachments: [{
        filename: { type: String },
        filepath: { type: String },
        mimetype: { type: String }, // To store file type for validation
    }],

    // Fields for admin approval
    is_approved_by_admin: { type: Number, default: 0 },
    note_from_admin: { type: String, trim: true, maxlength: 2000, default: null },
    approved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    approved_at: { type: Date, default: null },

    // User interaction section
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [commentSchema],
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