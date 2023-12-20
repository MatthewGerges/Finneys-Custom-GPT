const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Ensure you've run `npm install dotenv` and have a .env file with OPENAI_API_KEY

const app = express();
app.use(cors());
app.use(express.json());

const openAIKey = process.env.OPENAI_API_KEY;

app.post('/get-response', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: "user", content: userMessage }],
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${openAIKey}`,
                'Content-Type': 'application/json'
            }
        });

        // Log the response to the server console
        console.log('OpenAI response:', response.data);

        // Extract the content of the response from the assistant
        const botResponse = response.data.choices[0].message.content.trim();

        // Send the bot's response to the frontend
        res.json({ message: botResponse });

    } catch (error) {
        console.error('Axios error:', error.response);
        res.status(500).send('Error processing your request');
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
