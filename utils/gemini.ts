import { GoogleGenAI } from "@google/genai";

export async function getStructuredTextFromImage(base64Image: string) {
 
    const ai = new GoogleGenAI({ apiKey: 'AIzaSyBIir5u8tmHYtlTZERh5bGtdJ6RMlfmA-M' });
    
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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

    return result.text();
}