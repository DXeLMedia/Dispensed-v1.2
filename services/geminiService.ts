


import { GoogleGenAI, Type } from "@google/genai";
import { DJ, Role } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set for Gemini. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

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
    let fallback = `Get ready for ${title} at ${venueName}! Featuring the best of ${genres.join(', ')}.`;
    if (keywords) {
      fallback += ` Get ready for a night of ${keywords} vibes.`;
    }
    fallback += ` It's going to be an epic night!`;
    return fallback;
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

        const resultText = response.text.trim();
        if (!resultText) {
          return [];
        }
        const result = JSON.parse(resultText) as { dj_ids: string[] };

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

export const generateDjBio = async (
  djName: string,
  genres: string[],
  location: string,
  experience?: number,
  equipment?: string[],
  keywords?: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    return Promise.resolve(`Passionate DJ from ${location} spinning the best of ${genres.join(', ')}.`);
  }

  const prompt = `
    Create a cool, engaging, and professional DJ bio for a profile page. The tone should be confident and exciting, suitable for Cape Town's underground music scene.
    
    Details:
    - DJ Name: "${djName}"
    - Key Genres: ${genres.join(', ')}
    - Location: ${location}
    ${experience ? `- Years of Experience: ${experience}` : ''}
    ${equipment && equipment.length > 0 ? `- Owns Equipment: ${equipment.join(', ')}` : ''}
    ${keywords ? `- Vibe/Keywords: ${keywords}` : ''}

    Instructions:
    - Write in the first person (e.g., "I am...").
    - Keep it concise, around 3-5 sentences.
    - Highlight the key genres and location.
    - Weave in the experience and equipment naturally if provided.
    - Do not use hashtags.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
       config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating DJ bio with Gemini:", error);
    return `Passionate DJ from ${location} spinning the best of ${genres.join(', ')}. With ${experience || 'years'} of experience behind the decks, I'm ready to bring the energy.`;
  }
};

export const generatePostContent = async (
  topic: string,
  userName: string,
  userRole: Role
): Promise<string> => {
  if (!process.env.API_KEY) {
    return Promise.resolve(`Excited to announce: ${topic}! #capetownmusic #${userRole === Role.DJ ? 'djlife' : 'livemusic'}`);
  }

  const prompt = `
    You are a social media manager for the underground music scene in Cape Town. Your tone is cool, engaging, and authentic.
    A user wants to create a post. Generate a short, punchy post for them.

    Details:
    - Author Name: ${userName}
    - Author Role: ${userRole}
    - Post Topic / Keywords: "${topic}"

    Instructions:
    - Write the post from the user's perspective (first person: "I'm excited to...", "My new...", "We're hosting...").
    - Keep it concise, around 2-4 sentences.
    - End the post with 2-3 relevant, on-brand hashtags (e.g., #CapeTownTechno, #DeepHouseSA, #UndergroundSounds, #GigAlert). Do not use generic hashtags like #music or #love.
    - Do not wrap the output in quotes.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating post content with Gemini:", error);
    return `Excited to announce: ${topic}! #capetownmusic #${userRole === Role.DJ ? 'djlife' : 'livemusic'}`;
  }
};

export const generateGigFlyer = async (
  title: string,
  venueName: string,
  genres: string[],
  keywords: string
): Promise<string | null> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY not set. AI flyer generation disabled.");
    return null;
  }

  const prompt = `
    Create a cool, abstract, visually striking event flyer for an underground electronic music gig in Cape Town.
    - Event Name: "${title}"
    - Venue: "${venueName}"
    - Music Genres: ${genres.join(', ')}
    - Vibe/Keywords: ${keywords}
    - Do not include any actual text in the image. The design should be purely graphical and abstract, suitable for text to be overlaid later.
    - The style should be modern, edgy, and minimalist, using a dark, neon-infused color palette. Think distorted typography-like shapes (but not actual letters), grainy textures, and bold, simple geometric forms.
  `;

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '4:3', // Matching the UI aspect ratio
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages[0].image.imageBytes;
    }
    return null;
  } catch (error) {
    console.error("Error generating gig flyer with Gemini:", error);
    return null;
  }
};