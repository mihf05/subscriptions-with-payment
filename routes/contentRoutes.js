const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { checkPremium } = require('../middleware/premiumMiddleware');
const { 
    getPersonalizedFeed,
    getPremiumContent,
    getPremiumArticle
} = require('../controllers/contentController');

const router = express.Router();

router.use(protect);

// Regular content route
router.get('/feed', getPersonalizedFeed);

// Premium content routes
router.get('/premium', checkPremium, getPremiumContent);
router.get('/premium/:category/:articleId', checkPremium, getPremiumArticle);

module.exports = router;
