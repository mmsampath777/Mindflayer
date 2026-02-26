require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
const teamRoutes = require('./routes/teamRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Fallback JWT Secret logic
if (!process.env.JWT_SECRET) {
    const temporarySecret = crypto.randomBytes(64).toString('hex');
    process.env.JWT_SECRET = temporarySecret;
    console.warn('⚠️ WARNING: JWT_SECRET is not defined in .env');
    console.warn(`Generated temporary secret: ${temporarySecret}`);
    console.warn('Recommend saving this in your .env file for persistence.');
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/teams', teamRoutes);
app.use('/api/admin', adminRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'active', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ ERROR: MONGO_URI is not defined in .env');
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    });

// Export the app for Vercel
module.exports = app;

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🔥 Mindflayer.io Server screaming on port ${PORT}`);
    });
}
