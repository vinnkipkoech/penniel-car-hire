const express = require('express');
const router = express.Router();
const Car = require('../models/car');

// Get all cars for the frontend
router.get('/cars', async (req, res) => {
    const cars = await Car.find();
    res.json(cars);
});

// Admin: Add a new car
router.post('/admin/add-car', async (req, res) => {
    const newCar = new Car(req.body);
    await newCar.save();
    res.status(201).json({ message: "Car added successfully" });
});

module.exports = router;