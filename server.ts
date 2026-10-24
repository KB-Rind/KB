import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "10mb" }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Story generation endpoint
app.post("/api/generate-story", async (req, res) => {
  try {
    const {
      childName = "Little One",
      age = "3",
      favoriteAnimal = "Bunny",
      theme = "A sleepy adventure among gentle stars",
      tone = "calm and comforting",
      language = "English",
      additionalDetails = "",
    } = req.body;

    const systemPrompt = `You are Cozimo's master bedtime storyteller, specializing in soothing children ages 0 to 8 years old into restful sleep.
Follow these strict content principles:
1. Calm, comforting, safe, and positive. Never scary, sudden, jarring, or suspenseful.
2. The language and pacing must be gentle, rhythmic, and increasingly quiet toward the end.
3. Incorporate the child's name (${childName}), age (${age} years old), favorite animal (${favoriteAnimal}), and theme.
4. Conclude with slow, peaceful breaths, heavy cozy eyelids, soft blankets, and drifting peacefully off to sleep.
5. Provide 4 to 6 gentle story beats/pages so a parent or child can easily read or listen along with illustrations.`;

    const userPrompt = `Create a bedtime story for ${childName} (age ${age}).
Favorite animal: ${favoriteAnimal}.
Theme: ${theme}.
Tone: ${tone}.
Language: ${language}.
${additionalDetails ? `Special touches: ${additionalDetails}` : ""}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Gentle, charming bedtime title" },
            subtitle: { type: Type.STRING, description: "Short soothing subtitle" },
            estimatedReadMinutes: { type: Type.INTEGER, description: "Estimated read time in minutes (usually 3 to 5)" },
            recommendedSound: { 
              type: Type.STRING, 
              description: "Recommended ambient sleep sound (e.g. 'rain', 'lullaby', 'ocean', 'piano', 'heartbeat', 'crickets')" 
            },
            closingAffirmation: { 
              type: Type.STRING, 
              description: "Warm final whisper for the parent or narrator to say to the child, e.g. 'Goodnight Maya, you are safe, cherished, and loved.'" 
            },
            pages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pageNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  text: { type: Type.STRING, description: "2 to 4 sentences of poetic, soothing story prose" },
                  sceneDescription: { type: Type.STRING, description: "Visual description of the cozy scene" },
                  calmAction: { type: Type.STRING, description: "Optional calming physical cue like 'Take a soft deep breath' or 'Snuggle your pillow'" }
                },
                required: ["pageNumber", "text", "sceneDescription"]
              }
            }
          },
          required: ["title", "pages", "closingAffirmation", "recommendedSound"]
        }
      }
    });

    const storyText = response.text || "{}";
    const storyData = JSON.parse(storyText);
    res.json({ success: true, story: storyData });
  } catch (error: any) {
    console.warn("Story generation upstream notice:", error?.message);
    const { childName = "Little One", age = 3, favoriteAnimal = "Bunny", theme = "bedtime adventure" } = req.body;
    // Resilient personalized story generation so parents never experience bedtime disruption
    const fallbackStory = {
      title: `${childName} & the Sleepy ${favoriteAnimal}`,
      subtitle: `A soothing night journey through ${theme}`,
      estimatedReadMinutes: 4,
      recommendedSound: "lullaby",
      closingAffirmation: `Goodnight ${childName}. You are cozy, cherished, and loved as high as the silver moon.`,
      pages: [
        {
          pageNumber: 1,
          title: "The Sunset Glow",
          text: `The twilight sky turned shades of soft lilac and peach over the cozy meadow. ${childName} looked outside as the stars began their gentle nighttime glow, smiling at the quiet evening world.`,
          sceneDescription: `A calm pastel watercolor painting of a sleepy ${favoriteAnimal.toLowerCase()} looking at the stars from a warm bedroom window.`,
          calmAction: "Take one slow, deep breath in... and let it out softly like a warm breeze."
        },
        {
          pageNumber: 2,
          title: "The Friendly Little Visitor",
          text: `A gentle little ${favoriteAnimal.toLowerCase()} hopped onto the grass, wearing a tiny nightcap made of blue cloud fluff. 'It is time for rest, ${childName},' the ${favoriteAnimal.toLowerCase()} whispered with a sweet smile.`,
          sceneDescription: `The friendly ${favoriteAnimal.toLowerCase()} holding a warm glowing lantern under the smiling crescent moon.`,
          calmAction: "Roll your shoulders back and let your head sink into your soft pillow."
        },
        {
          pageNumber: 3,
          title: "The Blanket of Starlight",
          text: `Together, they looked at the moonlit trees swaying slowly back and forth, humming a quiet lullaby. Every breath felt lighter, and each blanket felt warmer and softer than before.`,
          sceneDescription: `Gentle stardust floating down like warm snowflakes over a cozy sleeping nest.`,
          calmAction: "Snuggle your favorite blanket close to your chin."
        },
        {
          pageNumber: 4,
          title: "Sweet Dreams Arrive",
          text: `The friendly ${favoriteAnimal.toLowerCase()} curled up in a soft cedar nest, letting out a delicious yawn. ${childName}'s heavy eyelids gently closed, drifting into the sweetest and warmest dreams.`,
          sceneDescription: `The child and little ${favoriteAnimal.toLowerCase()} sleeping peacefully under a serene starry canopy.`,
          calmAction: "Close your eyes softly now. Sleep is here."
        }
      ]
    };
    res.json({ success: true, story: fallbackStory, isOfflineFallback: true });
  }
});

// Nursery Rhyme Studio endpoint
app.post("/api/generate-rhyme", async (req, res) => {
  try {
    const {
      childName = "Little One",
      routineType = "sweet_dreams",
      customTopic = "Brush teeth and count stars",
      tone = "gentle and sing-song"
    } = req.body;

    const prompt = `Write a rhythmic, gentle 4-stanza nursery rhyme for bedtime routine.
Child: ${childName}
Routine: ${routineType} (${customTopic})
Tone: ${tone}.
Make it easy to chant or sing softly with natural rhymes (AABB or ABCB). The final stanza should wind down into quiet slumber.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a warm nursery rhyme writer for young children and loving parents.",
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            routineCategory: { type: Type.STRING },
            stanzas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stanzaNumber: { type: Type.INTEGER },
                  lines: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  parentActionTip: { type: Type.STRING }
                },
                required: ["stanzaNumber", "lines"]
              }
            },
            closingNote: { type: Type.STRING }
          },
          required: ["title", "stanzas"]
        }
      }
    });

    const rhymeText = response.text || "{}";
    res.json({ success: true, rhyme: JSON.parse(rhymeText) });
  } catch (error: any) {
    console.warn("Rhyme generation upstream notice:", error?.message);
    const { childName = "Little One", routineType = "brush_teeth", customTopic = "bedtime" } = req.body;
    const fallbackRhyme = {
      title: `${childName}'s Sleepy Time Rhyme`,
      routineCategory: routineType,
      stanzas: [
        {
          stanzaNumber: 1,
          lines: [
            `Evening comes and shadows fall,`,
            `Time for ${childName}, sweet and small.`,
            `Softly singing, soft and slow,`,
            `Watch the peaceful moonlight glow.`
          ],
          parentActionTip: "Gently stroke child's hair or forehead as you recite"
        },
        {
          stanzaNumber: 2,
          lines: [
            `Put away the daytime play,`,
            `Gentle night is on its way.`,
            `Close your eyes and breathe so deep,`,
            `Drifting into happy sleep.`
          ],
          parentActionTip: "Turn down the lights and tuck in the blanket"
        }
      ],
      closingNote: "Rest peacefully, safe and warm."
    };
    res.json({ success: true, rhyme: fallbackRhyme, isOfflineFallback: true });
  }
});

// Gemini TTS endpoint using gemini-3.8-flash-lite-tts
app.post("/api/generate-tts", async (req, res) => {
  try {
    const { text, voice = "Kore" } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required" });
    }

    // Limit length per speech block for optimal bedtime pacing
    const cleanText = text.slice(0, 800);

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash-lite-tts",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: "Soothing, gentle, warm bedtime storyteller, soft cadence, loving and quiet",
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({
        success: true,
        audioDataUrl: `data:audio/wav;base64,${base64Audio}`,
      });
    }

    res.json({ success: false, fallback: true });
  } catch (error: any) {
    console.warn("TTS error, falling back to client speech synthesis:", error?.message);
    res.json({ success: false, fallback: true, error: error?.message });
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Cozimo", time: new Date().toISOString() });
});

// Mount Vite or static dist
async function setupServer() {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cozimo bedtime server listening on port ${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start Cozimo server:", err);
  process.exit(1);
});
