import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import 'dotenv/config';

/**
 * Configuration
 */
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/ai', async (req, res) => {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  // Example = { payload: { message: "" } }
  const body = await req.body;

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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
