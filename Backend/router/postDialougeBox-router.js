const express = require('express');
const router = express.Router();
const DataItem = require('../models/dataItems-model'); 
router.get('/checkbox-options', async (req, res) => {
    try {
        // Fetch all data items from the database
        // We only need the '_id' and 'option' fields for our checkboxes
        const dataItems = await DataItem.find({}, '_id option').lean();

        // Format the data for the frontend:
        // Each item should have an 'id' and 'name' property
        const checkboxOptions = dataItems.map(item => ({
            id: item._id.toString(), // Convert MongoDB's ObjectId to a string
            name: item.option        // Use the 'option' field as the display name
        }));

        res.status(200).json(checkboxOptions);
    } catch (error) {
        console.error("Error fetching checkbox options from database:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
// New route to fetch sub-options based on main option ID
router.get('/sub-options/:mainOptionId', async (req, res) => {
    try {
        const { mainOptionId } = req.params;
        // Use findById to get the specific data item and its suboptions
        const dataItem = await DataItem.findById(mainOptionId).select('suboption').lean();

        if (!dataItem) {
            return res.status(404).json({ message: 'Main option not found.' });
        }

        // Return the array of sub-options
        res.status(200).json(dataItem.suboption || []);
    } catch (error) {
        console.error("Error fetching sub-options:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

module.exports = router;