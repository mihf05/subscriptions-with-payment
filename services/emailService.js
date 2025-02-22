const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const emailTemplates = {
    subscribe: (category) => ({
        subject: `Welcome to ${category} Updates!`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Subscription Confirmed! 🎉</h2>
                <p>You have successfully subscribed to <strong>${category}</strong> updates.</p>
                <p>You'll now receive the latest news and updates from the ${category} category.</p>
                <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
                    <p style="margin: 0;"><strong>Category:</strong> ${category}</p>
                    <p style="margin: 10px 0 0 0;"><strong>Status:</strong> Active</p>
                </div>
                <p>Thank you for subscribing!</p>
            </div>
        `
    }),
    unsubscribe: (category) => ({
        subject: `Unsubscribed from ${category} Updates`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Unsubscription Confirmed</h2>
                <p>You have been successfully unsubscribed from <strong>${category}</strong> updates.</p>
                <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
                    <p style="margin: 0;"><strong>Category:</strong> ${category}</p>
                    <p style="margin: 10px 0 0 0;"><strong>Status:</strong> Inactive</p>
                </div>
                <p>We're sorry to see you go. You can resubscribe at any time!</p>
            </div>
        `
    }),
    digest: (categories, content) => ({
        subject: `Your Weekly News Digest - ${categories.join(', ')}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
                <h1 style="color: #2c3e50; text-align: center;">Your Weekly News Digest</h1>
                <p style="text-align: center; color: #7f8c8d;">Here are your top stories from ${categories.join(', ')}</p>
                ${content}
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #7f8c8d;">
                    <p>You received this email because you're subscribed to: ${categories.join(', ')}</p>
                </div>
            </div>
        `
    })
};

exports.sendEmail = async (userEmail, category, type = 'subscribe', content = null) => {
    try {
        const template = type === 'digest' 
            ? emailTemplates[type](category, content)
            : emailTemplates[type](category);

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: userEmail,
            subject: template.subject,
            html: template.html
        };

        await transporter.sendMail(mailOptions);
        console.log(`${type} email sent to ${userEmail}`);
        return true;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
};
