const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true
    },
    redirectURL: {
        type: String,
        required: true,
    },
    visitHistory: [{
        timestamp: {
            type: Number  // Corrected the typo here
        }
    }]
}, { timestamps: true });

const URL = mongoose.model('URL', urlSchema); // 'URL' capitalized as per convention //1 -'url'
module.exports = URL;
