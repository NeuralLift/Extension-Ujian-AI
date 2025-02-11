import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

/**
 * Configuration
 */
const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, 'ui', 'index.html'));
});

const activeConnections = new Map();

app.post('/api/ai', async (req, res) => {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  // Example = { payload: { message: "" } }
  const body = await req.body;

  console.log(body);

  if (!body.payload.message) {
    return res.status(500).json({ message: 'Something went wrong' });
  }

  const aiResponse = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant. you must answer in Indonesian languange. the user will ask you a question and you must answer with 100% correct answer and you must provide the answer with indonesia languange DO NOT USING ENGLISH OR OTHER LANGUANGE JUST USE INDONESIA',
      },
      {
        role: 'user',
        content: `Apa jawaban dari soal berikut ini: 
            """
            ${body.payload.message}
            """

            tolong berikan jawaban yang terbaik ya! :D
            `,
      },
    ],
    model: 'llama3-70b-8192',
    temperature: 0.6,
  });

  if (!aiResponse.choices[0].message.content) {
    return res.status(500).json({ message: 'Something went wrong' });
  }

  return res
    .status(200)
    .json({ message: aiResponse.choices[0].message.content });
});

app.post('/api/v2/ai', async (req, res) => {
  const body = await req.body;

  console.log(body);

  if (!body.payload.message) {
    return res.status(500).json({ message: 'Something went wrong' });
  }

  const clientId = Date.now();
  activeConnections.set(clientId, res);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write('event: start\n');

  const aiResponse = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant. you must answer in Indonesian languange. the user will ask you a question and you must answer with 100% correct answer and you must provide the answer with indonesia languange DO NOT USING ENGLISH OR OTHER LANGUANGE JUST USE INDONESIA',
      },
      {
        role: 'user',
        content: `Apa jawaban dari soal berikut ini: 
            """
            ${body.payload.message}
            """

            tolong berikan jawaban yang terbaik ya! :D
            `,
      },
    ],
    model: 'deepseek-r1-distill-llama-70b',
    temperature: 0.6,
    stream: true,
  });

  for await (const chunk of aiResponse) {
    const content = chunk.choices[0]?.delta?.content || '';
    res.write(`data: ${JSON.stringify({ content })}\n\n`);
  }

  res.write('event: end\n');
  res.write('data: end\n\n');
  res.end();

  activeConnections.delete(clientId);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
