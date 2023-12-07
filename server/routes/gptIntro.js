const fetch = require('node-fetch'); 
var express = require('express');
const router = express.Router();
require('dotenv').config();

router.post('/api/gptintro', async (req, res) => {
    try {
        const userInput = req.body.query;
        const response = await fetch('https://api.openai.com/v1/engines/gpt-3.5-turbo/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: userInput,
                max_tokens: 150
            }),
        });

        const data = await response.json();
        console.log(data)
        res.send(data.choices[0].text);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'An error occurred', details: error.message });
    }
});''

module.exports = router;
