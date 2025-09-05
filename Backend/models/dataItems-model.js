// Backend/models/DataItem.js
const mongoose = require('mongoose');

const dataItemSchema = new mongoose.Schema({
    option: {
        type: String,
        required: true,
        trim: true
    },
    suboption: [{
        type: String,
        trim: true
    }],
    description: {
        type: String,
        trim: true,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ad_users',
        required: false
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ad_users',
        required: false
    }
}, { timestamps: true });

const DataItem = mongoose.model('DataItem', dataItemSchema);

module.exports = DataItem;