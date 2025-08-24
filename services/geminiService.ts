

import { GoogleGenAI, Type } from "@google/genai";
import { DJ } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set for Gemini. AI features will be disabled.");
}

let ai: GoogleGenAI | null = null;
if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const generateGigDescription = async (
  title: string,
  venueName: string,
  genres: string[],
  keywords: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    return Promise.resolve(`Get ready for ${title} at ${venueName}! Featuring the best of ${genres.join(', ')}. It's going to be an epic night!`);
  }

  const prompt = `
    Create a short, exciting, and punchy event description for a music gig. Be hyped and engaging.
    - Event Name: "${title}"
    - Venue: "${venueName}"
    - Music Genres: ${genres.join(', ')}
    - Vibe/Keywords: ${keywords}
    - Location: Cape Town, South Africa
    
    Make it sound like an unmissable underground event. Do not use hashtags. Keep it to 2-3 sentences.
  `;

  if (!ai) {
    return Promise.resolve(`Get ready for ${title} at ${venueName}! Featuring the best of ${genres.join(', ')}. It's going to be an epic night!`);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
       config: {
        // Disable thinking for faster, more direct responses suitable for this task.
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating gig description with Gemini:", error);
    // Fallback to a template if the API fails
    return `Get ready for ${title} at ${venueName}! Featuring the best of ${genres.join(', ')}. ${keywords}. It's going to be an epic night!`;
  }
};


export const findDJsWithAI = async (query: string, allDjs: DJ[]): Promise<string[]> => {
    if (!process.env.API_KEY) {
        console.warn("API_KEY not set. AI Scout disabled.");
        return [];
    }

    // Simplify DJ data to send to the model to save tokens and focus its analysis
    const simplifiedDjs = allDjs.map(dj => ({
        id: dj.id,
        name: dj.name,
        genres: dj.genres,
        bio: dj.bio,
        location: dj.location,
        tier: dj.tier,
    }));

    const prompt = `
        User query: "${query}"

        Available DJs:
        ${JSON.stringify(simplifiedDjs)}
    `;

    const systemInstruction = `You are an expert AI DJ scout for Cape Town's underground music scene. Your task is to analyze the list of available DJs and find the best matches (up to 5) based on the user's query. Consider genre, location, vibe from the bio, and tier. Respond ONLY with a JSON object containing a 'dj_ids' key, which is an array of the matched DJ IDs. Do not include any other text, reasoning, or explanations. If no good matches are found, return an empty array.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            dj_ids: {
                type: Type.ARRAY,
                description: "An array of DJ IDs that are the best match for the user's query.",
                items: {
                    type: Type.STRING,
                },
            },
        },
        required: ["dj_ids"],
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (result && Array.isArray(result.dj_ids)) {
            return result.dj_ids;
        }

        return [];
    } catch (error) {
        console.error("Error finding DJs with Gemini:", error);
        // Handle potential parsing errors or API failures
        return [];
    }
};
