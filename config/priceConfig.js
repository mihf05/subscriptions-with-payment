const premiumPlans = {
    monthly: {
        amount: 9.99,
        description: '1 month premium access',
        productName: 'Monthly Premium',
        duration: 30 // days
    },
    yearly: {
        amount: 99.99,
        description: '1 year premium access',
        productName: 'Yearly Premium',
        duration: 365 // days
    }
};

module.exports = { premiumPlans };
