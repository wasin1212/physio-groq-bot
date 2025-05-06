# Physio Groq Chatbot

LINE chatbot using **Groq API** (Mixtral model) + Node.js

## 🧰 Setup

```bash
cp .env.example .env
npm install
npm start
```

## 📦 Environment Variables

| Key                     | Description                    |
|--------------------------|--------------------------------|
| `GROQ_API_KEY`           | From https://console.groq.com |
| `LINE_CHANNEL_ACCESS_TOKEN` | From LINE Developer Console |
| `PORT`                   | Optional (default 3000)       |

## 🌐 Deploy on Render

1. Connect GitHub repo
2. Add environment variables
3. Set start command: `node index.js`
4. Webhook URL → `https://yourdomain.onrender.com/webhook`

Then test from LINE OA chat!
