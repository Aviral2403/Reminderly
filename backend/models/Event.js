const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
    },
    startDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
    },
    userId: {
        type: String,
        required: true
    },
    categories: {
        type: [String],
    },
    tag: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);
