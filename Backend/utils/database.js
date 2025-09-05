const mongoose = require('mongoose');
const dotenv = require('dotenv');

const URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(URI);
        console.log("Connectted");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with failure
    }
};
module.exports = connectDB;