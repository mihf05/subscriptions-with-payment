const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const { sendEmail } = require('../services/emailService');
const User = require('../models/User');
const { premiumPlans } = require('../config/priceConfig');

exports.createPaymentLink = async (req, res) => {
    try {
        const { type } = req.body;
        const userId = req.user._id;

        if (!premiumPlans[type]) {
            return res.status(400).json({ 
                message: 'Invalid subscription type',
                availablePlans: Object.keys(premiumPlans).map(plan => ({
                    type: plan,
                    ...premiumPlans[plan]
                }))
            });
        }

        const plan = premiumPlans[type];

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: plan.productName,
                        description: plan.description
                    },
                    unit_amount: Math.round(plan.amount * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/api/payments/success?session_id={CHECKOUT_SESSION_ID}&type=${type}`,
            cancel_url: `${req.protocol}://${req.get('host')}/api/payments/cancel`,
        });

        await Payment.create({
            userId,
            stripePaymentId: session.id,
            amount: plan.amount,
            status: 'pending',
            type
        });

        res.json({ 
            message: 'Payment link created',
            plan: {
                type,
                ...plan
            },
            url: session.url,
            sessionId: session.id
        });
    } catch (error) {
        console.error('Payment link creation error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.handlePaymentSuccess = async (req, res) => {
    try {
        const { session_id, type } = req.query;
        const session = await stripe.checkout.sessions.retrieve(session_id);
        const payment = await Payment.findOne({ stripePaymentId: session.id });

        if (payment) {
            payment.status = 'completed';
            await payment.save();

            // Update user's premium status
            const user = await User.findById(req.user._id);
            user.isPremium = true;
            user.premiumUntil = new Date(
                Date.now() + (type === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000
            );
            await user.save();

            // Send confirmation email
            await sendEmail(
                req.user.email, 
                'payment', 
                'payment_success', 
                { 
                    amount: payment.amount,
                    type,
                    expiresAt: user.premiumUntil
                }
            );
        }

        res.json({
            message: 'Premium access activated successfully',
            success: true,
            paymentId: payment._id,
            premiumUntil: user.premiumUntil
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPlans = async (req, res) => {
    try {
        res.json({
            message: 'Available premium plans',
            plans: Object.keys(premiumPlans).map(planType => ({
                type: planType,
                ...premiumPlans[planType]
            }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
