const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_REPLY_ENDPOINT = 'https://api.line.me/v2/bot/message/reply';

async function askChatGPT(message) {
  const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
    model: 'mixtral-8x7b-instruct',
    messages: [{ role: 'user', content: message }],
    temperature: 0.7
  }, {
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data.choices[0].message.content;
}

app.post('/webhook', async (req, res) => {
  const events = req.body.events;
  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userMessage = event.message.text;
      const replyToken = event.replyToken;
      try {
        const aiResponse = await askChatGPT(userMessage);
        await axios.post(LINE_REPLY_ENDPOINT, {
          replyToken: replyToken,
          messages: [{ type: 'text', text: aiResponse }]
        }, {
          headers: {
            'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (err) {
        console.error('Error Message:', err.message);
        if (err.response) {
          console.error('Response Data:', err.response.data);
          console.error('Response Status:', err.response.status);
        } else {
          console.error('Raw Error:', err);
        }
      }
    }
  }
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
