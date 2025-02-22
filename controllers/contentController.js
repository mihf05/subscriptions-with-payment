const User = require('../models/User');
const { fetchNewsByCategory } = require('../services/newsService');
const { generateContentAnalysis, getRelatedTopics } = require('../services/premiumContentService');

exports.getPersonalizedFeed = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.subscriptions.length) {
            return res.status(400).json({ 
                message: 'Please subscribe to some categories first' 
            });
        }

        // Fetch news for each subscribed category
        const newsPromises = user.subscriptions.map(category => 
            fetchNewsByCategory(category)
        );
        
        const newsResults = await Promise.all(newsPromises);
        
        // Combine and format results
        const personalizedFeed = user.subscriptions.reduce((acc, category, index) => {
            acc[category] = newsResults[index];
            return acc;
        }, {});

        res.json({
            subscriptions: user.subscriptions,
            feed: personalizedFeed
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching personalized feed',
            error: error.message 
        });
    }
};

exports.getPremiumContent = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        // Get enhanced news content with premium features
        const newsPromises = user.subscriptions.map(category => 
            fetchNewsByCategory(category, true)
        );
        
        const newsResults = await Promise.all(newsPromises);
        
        const premiumFeed = user.subscriptions.reduce((acc, category, index) => {
            const articles = newsResults[index];
            acc[category] = {
                articles: articles,
                premiumFeatures: {
                    analysis: generateContentAnalysis(articles),
                    relatedContent: getRelatedTopics(category),
                    downloadOptions: {
                        pdf: true,
                        excel: true
                    },
                    accessLevel: 'Premium'
                }
            };
            return acc;
        }, {});

        res.json({
            isPremium: true,
            premiumUntil: user.premiumUntil,
            subscriptions: user.subscriptions,
            premiumBenefits: {
                adFree: true,
                fullAccess: true,
                exclusiveContent: true
            },
            feed: premiumFeed
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching premium content',
            error: error.message 
        });
    }
};

exports.getPremiumArticle = async (req, res) => {
    try {
        const { articleId, category } = req.params;
        const article = await fetchArticleById(articleId, category);

        res.json({
            article: {
                ...article,
                premiumFeatures: {
                    fullContent: "Complete article content",
                    expertAnalysis: "Expert analysis and insights",
                    marketImpact: "Market impact assessment",
                    relatedArticles: "Similar premium articles",
                    downloadOptions: {
                        pdf: true,
                        word: true
                    }
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
