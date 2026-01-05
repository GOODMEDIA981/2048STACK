
import { GoogleGenAI } from "@google/genai";

// Fix: Always use the named parameter for API key and use process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGameCommentary = async (
  score: number, 
  lastMerge: number, 
  highestTile: number,
  isGameOver: boolean
): Promise<string> => {
  // Fix: Removed manual environment check as it is handled externally per guidelines

  const prompt = isGameOver 
    ? `The player just lost a 2048 physics stacking game. Their score was ${score} and their highest tile was ${highestTile}. Give them a short, witty, encouraging one-liner for their next try.`
    : `The player just merged two ${lastMerge} tiles to make a ${lastMerge * 2} in a 2048 physics game. Their current score is ${score}. Give a very short, hyped-up, 1-sentence reaction.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        // Fix: Removed maxOutputTokens as it's better to avoid it for short responses to prevent blocking
        temperature: 0.8,
      }
    });
    // Fix: Access response.text directly (it's a property, not a method)
    return response.text || "Epic merge!";
  } catch (err) {
    console.error("Gemini Error:", err);
    return "Nice move!";
  }
};
