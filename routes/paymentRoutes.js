const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { 
    createPaymentLink,
    handlePaymentSuccess,
    getPlans
} = require('../controllers/paymentController');

const router = express.Router();

// Public route - no auth required
router.get('/plans', getPlans);

// Protected routes
router.use(protect);
router.post('/create-link', createPaymentLink);
router.get('/success', handlePaymentSuccess);
router.get('/cancel', (req, res) => {
    res.json({ message: 'Payment cancelled', success: false });
});

module.exports = router;
