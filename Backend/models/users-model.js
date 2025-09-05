const mongoose = require('mongoose');
const argon2 = require('argon2');
const Counter = require('../models/counter-model');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        trim: true,
        required: false
    },
    username: {
        type: String,
        required: [true, "Please fill the username"],
        unique: [true, "Username already exists"],
        minlength: [3, "Username must be at least 3 characters long"],
        maxlength: [30, "Username must be at most 30 characters long"],
        match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"]
    },
    email: {
        type: String,
        required: [true, "Please fill the email id"],
        unique: [true, "Email already exists"],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please fill a valid email address"],
        lowercase: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    name: {
        type: String,
        required: [true, "Please fill the name"],
    },
    password: {
        type: String,
        required: [true, "Please fill the password"],
        minlength: [10, "Password must be at least 10 characters long"],
        select: false,
    },
    mobile: {
        type: Number,
        required: [true, "Please fill the mobile number"],
        unique: [true, "Mobile number already exists"],
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    otp: {
        type: String,
        default: null,
    },
    otpExpires: {
        type: Date,
        default: null,
    },
    isEmailVerified: {
        type: Number,
        default: 0,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

// Pre-save hook to handle userId generation and password hashing
userSchema.pre('save', async function (next) {
    // Generate userId for new documents without existing userId
    if (this.isNew && !this.userId) {
        try {
            const currentYear = new Date().getFullYear();
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'userId' },
                { $inc: { sequence_value: 1 } },
                { new: true, upsert: true }
            );
            
            if (!counter) {
                throw new Error('Failed to generate user ID');
            }
            
            // Pad sequence value to 5 digits (e.g., 00001)
            const paddedSequence = String(counter.sequence_value).padStart(5, '0');
            this.userId = `MC-${currentYear}${paddedSequence}`;
        } catch (error) {
            return next(error);
        }
    }

    // Hash password if modified
    if (this.isModified('password')) {
        try {
            this.password = await argon2.hash(this.password, {
                type: argon2.argon2id,
                memoryCost: 2 ** 16,
                timeCost: 3,
                parallelism: 1
            });
        } catch (error) {
            return next(error);
        }
    }

    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await argon2.verify(this.password, candidatePassword);
    } catch (error) {
        throw new Error("Password verification failed");
    }
};

const User = mongoose.model('User', userSchema);
module.exports = User;