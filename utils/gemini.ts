import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyBIir5u8tmHYtlTZERh5bGtdJ6RMlfmA-M'; // Replace with your actual API key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`;

export async function getStructuredTextFromImage(base64Image: string) {
  try {
    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          parts: [
            { text: 'Please extract and structure the text from this image.' },
            {
              inlineData: {
                mimeType: 'image/jpeg', // Assuming JPEG. Adjust if needed.
                data: base64Image,
              },
            },
          ],
        },
      ],
    });
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return null;
  }
}