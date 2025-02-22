const { fetchNewsByCategory } = require('./newsService');
const User = require('../models/User');
const { sendEmail } = require('./emailService');

const createDigestContent = (articles) => {
    let digest = '';
    Object.entries(articles).forEach(([category, news]) => {
        digest += `
            <h2 style="color: #2c3e50; margin-top: 20px;">${category} Top Stories</h2>
            <div style="margin-bottom: 20px;">
        `;
        
        news.slice(0, 3).forEach(article => {
            digest += `
                <div style="margin-bottom: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">
                    <h3 style="margin: 0;"><a href="${article.url}" style="color: #3498db; text-decoration: none;">${article.title}</a></h3>
                    <p style="margin: 5px 0;">${article.description || ''}</p>
                </div>
            `;
        });
        
        digest += '</div>';
    });
    return digest;
};

const sendWeeklyDigest = async () => {
    try {
        const users = await User.find({ subscriptions: { $exists: true, $ne: [] } });
        
        for (const user of users) {
            // Fetch news for each subscribed category
            const newsPromises = user.subscriptions.map(category => 
                fetchNewsByCategory(category)
            );
            const newsResults = await Promise.all(newsPromises);
            
            // Combine results by category
            const digest = user.subscriptions.reduce((acc, category, index) => {
                acc[category] = newsResults[index];
                return acc;
            }, {});

            // Send digest email
            await sendEmail(user.email, user.subscriptions, 'digest', createDigestContent(digest));
        }
        console.log('Weekly digests sent successfully');
    } catch (error) {
        console.error('Error sending weekly digests:', error);
    }
};

module.exports = { sendWeeklyDigest };
