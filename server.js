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
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"], // Allows your Live Server
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Crucial: Handle the browser's "Preflight" check
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
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
        const newUser = new User({ fullName, email, password });
        await newUser.save();
        res.status(201).json({ success: true, message: "Account created successfully" });
    } catch (err) {
        res.status(400).json({ success: false, error: "User already exists or data invalid" });
    }
});

// --- UPDATED LOGIN ROUTE (Handles BOTH Admin and Client) ---
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // A. Check for Admin First (Hardcoded for Demo)
        if (email === "admin@penniel.com" && password === "penniel2026") {
            const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ success: true, token, role: 'admin' });
        }

        // B. Check MongoDB for regular clients
        const user = await User.findOne({ email, password });
        
        if (user) {
            const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ 
                success: true, 
                token, 
                role: 'user', 
                name: user.fullName 
            });
        }

        // C. If neither matches
        res.status(401).json({ success: false, message: "Invalid email or password" });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error during login" });
    }
});

// ADMIN: Add a new car
app.post('/api/admin/add-car', async (req, res) => {
    try {
        const newCar = new Car(req.body);
        await newCar.save();
        res.status(201).json(newCar);
    } catch (err) {
        res.status(400).json({ error: "Failed to add car" });
    }
});

// DELETE A CAR
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
    console.log(`🚀 Server running on port ${PORT}`);
});