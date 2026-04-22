const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;
        const user = new User({ fullName, email, phone, password });
        await user.save();
        
        // Create token so they are automatically logged in
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(201).json({ token, user: { fullName, email } });
    } catch (err) {
        res.status(400).json({ error: "Registration failed" });
    }
});