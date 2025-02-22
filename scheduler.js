require('dotenv').config();
const cron = require('node-cron');
const { sendWeeklyDigest } = require('./services/digestService');

// Schedule weekly digest every Sunday at 9:00 AM
cron.schedule('0 9 * * 0', async () => {
    console.log('Starting weekly digest distribution...');
    await sendWeeklyDigest();
});

console.log('Digest scheduler initialized');
