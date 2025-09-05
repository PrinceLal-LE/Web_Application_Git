const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to your User model (assuming its model name is 'User' from users-model.js)
        required: true,
        unique: true // Each user should have only one profile
    },
    cover_photo_filepath: {
        type: String,
        default: null // Relative path to the stored file
    },
    cover_photo_filename: {
        type: String,
        default: null // Original filename or unique generated name
    },
    profile_photo_filepath: {
        type: String,
        default: null
    },
    profile_photo_filename: {
        type: String,
        default: null
    },
    address: {
        type: String,
        trim: true,
        default: null
    },
    profession: {
        type: String,
        trim: true,
        default: null
    },
    about_me: {
        type: String,
        trim: true,
        maxlength: 255, // Enforce maximum length
        default: null
    },
    skills: { // Changed to lowercase 'skills' for consistency
        type: String,
        trim: true,
        maxlength: 1000, // Enforce maximum length
        default: null
    },
    mobile_number: { // Added based on requirement for validation
        type: String,
        trim: true,
        default: null
    },
    linkedin_profile_url: {
        type: String,
        trim: true,
        default: null
    },
    twitter_profile_url: {
        type: String,
        trim: true,
        default: null
    },
    created_by_email: {
        type: String,
        required: true,
        trim: true
    },
    updated_by_email: {
        type: String,
        trim: true,
        default: null // Will be set on updates
    }
}, {
    timestamps: {
        createdAt: 'created_at', // Mongoose automatically manages this
        updatedAt: 'updated_at'  // Mongoose automatically manages this
    }
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;