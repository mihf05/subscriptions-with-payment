const axios = require('axios');

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

const categoryMapping = {
    'Tech': 'technology',
    'Health': 'health',
    'Business': 'business'
};

exports.fetchNewsByCategory = async (category) => {
    try {
        const mappedCategory = categoryMapping[category];
        const response = await axios.get(`${NEWS_API_BASE_URL}/top-headlines`, {
            params: {
                category: mappedCategory,
                language: 'en',
                apiKey: NEWS_API_KEY
            }
        });
        return response.data.articles;
    } catch (error) {
        console.error(`Error fetching ${category} news:`, error);
        return [];
    }
};
