import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

export async function getStructuredTextFromImage(base64Image: string) {
  const prompt = "Please extract and structure the text from this image (base64 encoded JPEG):\n" + base64Image;
  const completion = await openai.chat.completions.create({
    model: "gpt-4-vision",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Please extract and structure the text from this image." },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
        ]
      }
    ],
    max_tokens: 1024,
  });
  return completion.choices[0]?.message?.content ?? null;
}
