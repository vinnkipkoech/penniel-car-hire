// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500", "https://penniel-car-hire.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json()); 
app.use(express.static('public')); 

// 1. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((err) => console.error('❌ Database connection error:', err));

// 2. Models
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

// 3. JWT Protection Middleware
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); // Moves to the next function (the actual route)
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

// 4. API Routes

// GET ALL CARS
app.get('/api/cars', async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch cars" });
    }
});

// REGISTER USER
app.post('/api/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const newUser = new User({ fullName, email, password });
        await newUser.save();
        res.status(201).json({ success: true, message: "Account created successfully" });
    } catch (err) {
        res.status(400).json({ success: false, error: "User already exists or data invalid" });
    }
});

// LOGIN (Handles Admin and User)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (email === "admin@penniel.com" && password === "penniel2026") {
            const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' });
            return res.json({ success: true, token, role: 'admin', isAdmin: true });
        }

        const user = await User.findOne({ email, password });
        if (user) {
            const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '2h' });
            return res.json({ success: true, token, role: 'user', name: user.fullName });
        }

        res.status(401).json({ success: false, message: "Invalid email or password" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error during login" });
    }
});

// ADMIN: Add a new car (Protected)
app.post('/api/admin/add-car', protect, async (req, res) => {
    try {
        const newCar = new Car(req.body);
        await newCar.save();
        res.status(201).json({ success: true, car: newCar });
    } catch (err) {
        res.status(400).json({ success: false, error: "Failed to add car" });
    }
});

// ADMIN: Delete a car (Protected)
app.delete('/api/admin/cars/:id', protect, async (req, res) => {
    try {
        await Car.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Car successfully removed from fleet" });
    } catch (err) {
        res.status(500).json({ success: false, error: "Failed to delete car" });
    }
});

// 5. Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
