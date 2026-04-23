// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows the server to read JSON from the frontend
app.use(express.static('public')); // Serves your HTML/CSS files from a 'public' folder

// 1. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((err) => console.error('❌ Database connection error:', err));

// 2. Import Models (Internal definitions for this example)
const Car = mongoose.model('Car', new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    image: String,
    isAvailable: { type: Boolean, default: true }
}));

const User = mongoose.model('User', new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
}));

// 3. API Routes

// FLEET: Get all cars
app.get('/api/cars', async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch cars" });
    }
});

// AUTH: Register new user (from Booking Modal)
app.post('/api/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        // In Phase 3, you'd hash the password here using bcrypt
        const newUser = new User({ fullName, email, password });
        await newUser.save();
        res.status(201).json({ message: "Account created successfully" });
    } catch (err) {
        res.status(400).json({ error: "User already exists or data invalid" });
    }
});

// ADMIN: Add a new car (from Admin Dashboard)
app.post('/api/admin/add-car', async (req, res) => {
    try {
        const newCar = new Car(req.body);
        await newCar.save();
        res.status(201).json(newCar);
    } catch (err) {
        res.status(400).json({ error: "Failed to add car" });
    }
});

// DELETE A CAR (Phase A)
app.delete('/api/admin/cars/:id', async (req, res) => {
    try {
        await Car.findByIdAndDelete(req.params.id);
        res.json({ message: "Car successfully removed from fleet" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete car" });
    }
});

// 4. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});