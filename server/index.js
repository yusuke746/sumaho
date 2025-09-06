const express = require('express');
const multer = require('multer');
const { createWorker } = require('tesseract.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = 57941; // Use the provided port

const upload = multer({ dest: 'uploads/' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image file uploaded.');
  }

  try {
    // OCR
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(req.file.path);
    await worker.terminate();

    // Gemini API for structuring
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Extract structured data from the following text. If the text contains information about a product, extract its name, price, and any other relevant details. If it's a receipt, extract items, quantities, and total. If it's a business card, extract name, title, company, phone, email. Return the data in JSON format. Text: ${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const structuredData = response.text();

    res.json({ text, structuredData });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Error processing image.');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening at http://0.0.0.0:${port}`);
});