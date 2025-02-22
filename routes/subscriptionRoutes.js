const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { 
    subscribe, 
    unsubscribe, 
    getSubscriptions 
} = require('../controllers/subscriptionController');

const router = express.Router();

router.use(protect); // All subscription routes are protected

router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);
router.get('/list', getSubscriptions);

module.exports = router;
