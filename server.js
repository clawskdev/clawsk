const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');
require('dotenv').config();

const app = express();
// Railway akan mengisi PORT secara otomatis, jangan dipaksa ke 3000
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY, 
});

app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1500,
      system: "Kamu adalah Clawsk, Intelligence Lobster dari clawsk.site. Kamu cerdas dan cool.",
      messages: [...history, { role: "user", content: message }],
    });

    res.json({ reply: response.content[0].text });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Protokol otak Clawsk terganggu.' });
  }
});

// WAJIB: Gunakan '0.0.0.0' untuk deployment
app.listen(PORT, '0.0.0.0', () => {
  console.log(`----------------------------------------`);
  console.log(`🚀 CLAWSK.SITE PROTOCOL: ONLINE`);
  console.log(`📡 Listening on port: ${PORT}`);
  console.log(`----------------------------------------`);
});