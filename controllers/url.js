const shortid = require("shortid");
const URL = require('../models/url');

// Handle generating a new short URL
async function handleGenerateNewShortURL(req, res) {
    const body = req.body;

    // Check if URL is provided
    if (!body.url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Generate a short ID using shortid
        const shortID = shortid.generate(); // Use shortid.generate() to create the ID

        // Create the new URL entry in the database
        await URL.create({
            shortId: shortID,
            redirectURL: body.url,
            visitHistory: [],
        });

        // Return the generated short ID
        return res.render("home",{
            id:shortID
        })
       // return res.status(201).json({ id: shortID }); // 201 for resource creation
    } catch (error) {
        // Error handling
        console.error('Error creating new short URL:', error);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
}

// Handle fetching URL analytics
async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId; // Use req.params to access URL parameters

    try {
        // Find the URL entry in the database
        const result = await URL.findOne({ shortId });

        if (!result) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        // Return analytics data
        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics
};
