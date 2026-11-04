import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

export function getGeminiModel(): GenerativeModel {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
}

export async function callGeminiText(prompt: string): Promise<string | null> {
  try {
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('[LynkSell] callGeminiText error:', error);
    return null;
  }
}

export async function callGeminiVision(imageBase64: string, mimeType: string, prompt: string): Promise<string | null> {
  try {
    const model = getGeminiModel();
    // Hapus data URI prefix jika ada sebelum kirim
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType
        }
      },
      prompt
    ]);
    return result.response.text();
  } catch (error) {
    console.error('[LynkSell] callGeminiVision error:', error);
    return null;
  }
}
