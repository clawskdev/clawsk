const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middleware
app.use(express.json());

// 2. Menghubungkan ke folder 'public' agar index.html dan logo.png bisa diakses
app.use(express.static(path.join(__dirname, 'public')));

// 3. Konfigurasi AI Anthropic (Claude)
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY, 
});

// 4. Endpoint API Chat untuk Clawsk
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1500,
      // UPDATE IDENTITAS: Menggunakan brand clawsk.id dan karakter Intelligence Lobster
      system: `Kamu adalah Clawsk, AI Agent resmi dari clawsk.id. 
               Identitasmu adalah "Your Intelligence Lobster". 
               Kamu cerdas, taktis, dan memiliki gaya bahasa yang cool, tajam, namun tetap profesional. 
               Gunakan bahasa Indonesia yang natural. Jika relevan, tunjukkan sisi "lobster" yang kuat dan protektif terhadap efisiensi kerja pengguna.`,
      messages: [...history, { role: "user", content: message }],
    });

    res.json({ reply: response.content[0].text });
  } catch (error) {
    console.error('Error dari API Claude:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada protokol otak AI Clawsk.' });
  }
});

// 5. Jalankan Server dengan tampilan terminal yang lebih rapi
app.listen(PORT, () => {
  console.log(`\x1b[33m%s\x1b[0m`, `----------------------------------------`);
  console.log(`\x1b[32m%s\x1b[0m`, `🚀 CLAWSK.ID PROTOCOL: ONLINE`);
  console.log(`\x1b[36m%s\x1b[0m`, `🌐 Link: http://localhost:${PORT}`);
  console.log(`\x1b[33m%s\x1b[0m`, `----------------------------------------`);
});