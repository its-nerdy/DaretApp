const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Increase limit to allow image uploads (base64)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(__dirname));

const uri = process.env.MONGODB_URI;
let db;

if (uri) {
    const client = new MongoClient(uri);
    client.connect()
        .then(() => {
            db = client.db('daretapp');
            console.log("Connected to MongoDB");
        })
        .catch(err => console.error("MongoDB connection error:", err));
} else {
    console.warn("WARNING: MONGODB_URI not provided. Please set it in your environment variables on Render.");
}

// API to create a new account
app.post('/api/signup', async (req, res) => {
    const { id, name, email, pass } = req.body;
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    try {
        const users = db.collection('users');
        const existing = await users.findOne({ id });
        if (existing) return res.status(400).json({ error: 'User already exists' });
        
        const newUser = { id, name, email, pass, avatar: null, fluxData: [], echData: [], fluxIdCnt: 1, echIdCnt: 1 };
        await users.insertOne(newUser);
        
        delete newUser._id; // Clean response for frontend
        res.json({ success: true, user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// SMART LOGIN ROUTE (Fixes Name/Email search)
app.post('/api/login', async (req, res) => {
    const { identifier, pass } = req.body;
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    try {
        const users = db.collection('users');
        const searchStr = identifier.toLowerCase();

        const userFound = await users.findOne({
            $or: [
                { id: searchStr },
                { name: { $regex: new RegExp(`^${searchStr}$`, 'i') } },
                { email: { $regex: new RegExp(`^${searchStr}$`, 'i') } }
            ]
        });

        if (userFound && userFound.pass === pass) {
            delete userFound._id;
            res.json({ success: true, user: userFound });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// API to load user data when they login on a new device
app.get('/api/data', async (req, res) => {
    const { id } = req.query;
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    try {
        const users = db.collection('users');
        const user = await users.findOne({ id });
        if (user) {
            delete user._id;
            res.json({ success: true, user });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// API to save data whenever a change is made
app.post('/api/sync', async (req, res) => {
    const { id, fluxData, echData, fluxIdCnt, echIdCnt, avatar, pass } = req.body;
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    try {
        const users = db.collection('users');
        const updateDoc = {
            $set: { fluxData, echData, fluxIdCnt, echIdCnt }
        };
        if (avatar !== undefined) updateDoc.$set.avatar = avatar;
        if (pass) updateDoc.$set.pass = pass;

        await users.updateOne({ id }, updateDoc);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`===========================================`);
    console.log(`🚀 DARETApp Server is running on port ${PORT}!`);
    console.log(`===========================================`);
});