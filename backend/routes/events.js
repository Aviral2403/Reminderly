const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const verifyToken = require('../middleware/verifyToken');

// CREATE
router.post('/create', verifyToken, async (req, res) => {
    try {
        const newEvent = new Event({
            title: req.body.title,
            desc: req.body.desc,
            startDate: new Date(req.body.startDate),
            startTime: req.body.startTime,
            userId: req.body.userId,
            categories: req.body.categories,
            tag: req.body.tag,
        });

        const savedEvent = await newEvent.save();
        res.status(200).json(savedEvent);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json("Event has been deleted!");
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedEvent);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET events for the authenticated user
router.get("/user/:userId", verifyToken, async (req, res) => {
    try {
        const events = await Event.find({ userId: req.params.userId })
            .sort({ startDate: 1, startTime: 1 });  // Sort by startDate and startTime in ascending order
        
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/user/:userId/upcoming", verifyToken, async (req, res) => {
    try {
        // Get the current date and strip the time portion
        const currentDate = new Date();
        const currentDayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        
        // Get the current time in "HH:mm" format
        const currentTime = currentDate.toTimeString().slice(0, 5);

        const upcomingEvents = await Event.find({
            userId: req.params.userId,
            $or: [
                { startDate: { $gt: currentDayStart } },  // Events starting after today
                { 
                    startDate: { $eq: currentDayStart }, 
                    startTime: { $gte: currentTime }  // Events starting today but later than the current time
                }
            ]
        })
        .sort({ startDate: 1, startTime: 1 })  // Sort first by date, then by time
        .limit(2);  
        
        res.status(200).json(upcomingEvents);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET EVENT DETAILS (/:id)
router.get("/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        res.status(200).json(event);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
