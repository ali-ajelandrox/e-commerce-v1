// scripts/initCounters.js
const mongoose = require('mongoose');
const Counter = require('../src/models/Counter');

const initCounters = async () => {
    await mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

    await Counter.updateOne({ modelName: 'User' }, { $setOnInsert: { sequenceValue: 0 } }, { upsert: true });

    console.log('Counters initialized');
    mongoose.disconnect();
};

initCounters().catch(err => console.error('Error initializing counters:', err));
