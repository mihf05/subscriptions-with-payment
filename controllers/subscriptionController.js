const User = require('../models/User');
const { sendEmail } = require('../services/emailService');

exports.subscribe = async (req, res) => {
    try {
        const { category } = req.body;
        const userId = req.user._id;

        if (!['Tech', 'Health', 'Business'].includes(category)) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        const user = await User.findById(userId);
        if (user.subscriptions.includes(category)) {
            return res.status(400).json({ message: 'Already subscribed to this category' });
        }

        user.subscriptions.push(category);
        await user.save();

        // Send subscription email
        const emailSent = await sendEmail(user.email, category, 'subscribe');

        res.json({ 
            message: 'Subscription successful', 
            subscriptions: user.subscriptions,
            emailStatus: emailSent ? 'sent' : 'failed'
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.unsubscribe = async (req, res) => {
    try {
        const { category } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user.subscriptions.includes(category)) {
            return res.status(400).json({ message: 'Not subscribed to this category' });
        }

        user.subscriptions = user.subscriptions.filter(sub => sub !== category);
        await user.save();

        // Send unsubscription email
        const emailSent = await sendEmail(user.email, category, 'unsubscribe');

        res.json({ 
            message: 'Unsubscription successful', 
            subscriptions: user.subscriptions,
            emailStatus: emailSent ? 'sent' : 'failed'
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getSubscriptions = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ subscriptions: user.subscriptions });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
