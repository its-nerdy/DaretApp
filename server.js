const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'database.json');

// Increase limit to allow image uploads (base64)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// Initialize Database if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: {} }, null, 2));
}

function readDB() { 
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); 
}

function writeDB(data) { 
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); 
}

// API to create a new account
app.post('/api/signup', (req, res) => {
    const { id, name, email, pass } = req.body;
    const db = readDB();
    
    if (db.users[id]) return res.status(400).json({ error: 'User already exists' });
    
    db.users[id] = { name, email, pass, avatar: null, fluxData: [], echData: [], fluxIdCnt: 1, echIdCnt: 1 };
    writeDB(db);
    
    // Inject 'id' back into the response so the frontend knows who logged in
    res.json({ success: true, user: { id: id, ...db.users[id] } });
});

// 🚀 SMART LOGIN ROUTE (Fixes Name/Email search)
app.post('/api/login', (req, res) => {
    // We expect 'identifier' from script.js now, not 'id'
    const { identifier, pass } = req.body;
    const db = readDB();
    
    let userFound = null;
    let userId = null;

    if (identifier) {
        const searchStr = identifier.toLowerCase();

        // Search through the nested "users" object in your database.json
        for (const key in db.users) {
            const u = db.users[key];
            
            // Match the Dictionary Key, exact Name, or Email
            if (
                key.toLowerCase() === searchStr || 
                (u.name && u.name.toLowerCase() === searchStr) || 
                (u.email && u.email.toLowerCase() === searchStr)
            ) {
                userFound = u;
                userId = key; // Save the key to send back to frontend
                break;
            }
        }
    }

    // Verify Password (Passwords remain case-sensitive)
    if (userFound && userFound.pass === pass) {
        // Inject the 'id' back into the response
        res.json({ success: true, user: { id: userId, ...userFound } });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// API to load user data when they login on a new device
app.get('/api/data', (req, res) => {
    const { id } = req.query;
    const db = readDB();
    
    if (db.users[id]) {
        res.json({ success: true, user: { id: id, ...db.users[id] } });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// API to save data whenever a change is made
app.post('/api/sync', (req, res) => {
    const { id, fluxData, echData, fluxIdCnt, echIdCnt, avatar, pass } = req.body;
    const db = readDB();
    
    if (db.users[id]) {
        db.users[id].fluxData = fluxData;
        db.users[id].echData = echData;
        db.users[id].fluxIdCnt = fluxIdCnt;
        db.users[id].echIdCnt = echIdCnt;
        if (avatar !== undefined) db.users[id].avatar = avatar;
        if (pass) db.users[id].pass = pass;
        
        writeDB(db);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n===========================================`);
    console.log(`🚀 DARETApp Server is running and ALIVE!`);
    console.log(`💻 Access on this computer: http://localhost:${PORT}`);
    console.log(`📱 Access on other devices: Find your IPv4 address and use it`);
    console.log(`===========================================\n`);
});