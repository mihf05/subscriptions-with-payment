const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (amount) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents and ensure integer
            currency: 'usd',
            payment_method_types: ['card'], // Explicitly specify payment method
            confirmation_method: 'manual', // Add manual confirmation
        });
        return paymentIntent;
    } catch (error) {
        throw new Error('Error creating payment intent: ' + error.message);
    }
};

exports.confirmPayment = async (paymentIntentId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        // Check for various successful states
        return ['succeeded', 'processing', 'requires_capture'].includes(paymentIntent.status);
    } catch (error) {
        console.error('Stripe confirmation error:', error);
        return false;
    }
};
