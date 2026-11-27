import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  ta: 'Tamil (தமிழ்)',
  hi: 'Hindi (हिन्दी)',
  ml: 'Malayalam (മലയാളം)',
  te: 'Telugu (తెలుగు)',
  kn: 'Kannada (ಕನ್ನಡ)',
};

const STORE_CONTEXT = `
Store Name: Kora & Loom (Handpicked Heritage Sarees)
Showroom Address: 12 Sample Loom Street, Heritage Market, Sample City – 600001, India.
Phone / WhatsApp: +91 81245 36947
Email: hello@koraandloom-demo.example
Instagram: @koraandloom_demo (https://www.instagram.com/koraandloom_demo)
Hours: Mon–Sat, 10:00 AM – 8:30 PM IST

Curated Catalog:
1. Kanchipuram Temple Zari Emerald Saree (KL-KNC-101) — ₹3,499 — Pure Mulberry Kanchipuram Silk, 0.9m matching blouse piece.
2. Banarasi Katan Crimson Bridal Saree (KL-BNR-204) — ₹2,899 — Twisted Katan Silk, 0.85m crimson brocade blouse piece.
3. Maheshwari Ochre & Rose Cotton Silk (KL-MHS-089) — ₹1,000 — 320g featherlight cotton-silk, contrast blouse piece.
4. Chanderi Ivory & Gold Tissue Linen Saree (KL-CHN-118) — ₹1,699 — Pure flax linen & silk warp, 0.85m blouse piece.
5. Arani Soft Silk Courtyard Drape (KL-ARN-142) — ₹2,199 — Unstarched soft silk, 0.9m matching emerald blouse piece.
6. Kalamkari Padded Silk Blouse & Jhumka Pair (KL-BLS-301) — ₹1,299 — Stitched Size S/M/L with 2-inch seam margin + temple jhumkas.
7. Royal Maroon & Peacock Teal Saree Duo (KL-GFT-601) — ₹3,598 — 2-saree festive gift box.
8. Kanchipuram Korvai Peacock Pallu Heirloom (KL-KNC-309) — ₹4,299 — Pure Mulberry Korvai gold zari silk.

Policies & Offers:
- Free Express Delivery on orders ₹1,999+ across India. Below ₹1,999 shipping is ₹99.
- Payments: UPI, Cards, NetBanking, and Cash on Delivery (COD).
- Promo codes: KORA10 (10% off orders ₹3,999+), TROUSSEAU15 (15% off orders ₹6,999+).
- 7-Day Inspection & Exchange support.
`;

interface ChatHistoryItem {
  role: 'user' | 'assistant';
  text: string;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/chat', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json({
        error: 'AI assistant is currently unavailable because GEMINI_API_KEY is not configured in Settings > Secrets.',
      });
      return;
    }

    const { message, language = 'en', history = [] } = req.body as {
      message?: string;
      language?: string;
      history?: ChatHistoryItem[];
    };

    const trimmed = typeof message === 'string' ? message.trim() : '';
    if (!trimmed) {
      res.status(400).json({ error: 'Please enter a message.' });
      return;
    }

    const targetLanguage = LANGUAGE_NAMES[language] || 'English';

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const recentHistory = Array.isArray(history)
        ? history
            .slice(-8)
            .map((h) => `${h.role === 'user' ? 'Customer' : 'Assistant'}: ${String(h.text || '').slice(0, 500)}`)
            .join('\n')
        : '';

      const prompt = recentHistory
        ? `Conversation so far:\n${recentHistory}\n\nCustomer: ${trimmed}`
        : trimmed;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction: `You are the warm, knowledgeable customer support stylist for Kora & Loom, a handpicked saree boutique.
CRITICAL LANGUAGE RULE: Always reply naturally and clearly in ${targetLanguage}. Even if the customer writes short queries, respond in ${targetLanguage}.
Keep replies concise (2–4 short sentences or neat bullet points), helpful, accurate to the store catalog and policies below, and easy to act on. Never invent products or discounts not listed below.

${STORE_CONTEXT}`,
        },
      });

      const reply = response.text?.trim();
      if (!reply) {
        res.status(502).json({ error: 'Unable to generate a response right now. Please try again.' });
        return;
      }

      res.json({ reply });
    } catch (err: unknown) {
      const messageText = err instanceof Error ? err.message : 'Unexpected error contacting AI support.';
      console.error('Gemini chat error:', err);
      res.status(500).json({ error: messageText });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kora & Loom server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
