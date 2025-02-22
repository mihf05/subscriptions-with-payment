const checkPremium = async (req, res, next) => {
    try {
        if (!req.user.isPremium) {
            return res.status(403).json({
                message: 'Premium subscription required',
                isPremium: false,
                upgradeLink: '/api/payments/create-link'
            });
        }

        if (req.user.premiumUntil && new Date() > new Date(req.user.premiumUntil)) {
            req.user.isPremium = false;
            await req.user.save();
            return res.status(403).json({
                message: 'Premium subscription expired',
                isPremium: false,
                upgradeLink: '/api/payments/create-link'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { checkPremium };
