/**
 * Generate contextual creator images using Gemini
 *
 * Usage: API_KEY=your_key npx tsx scripts/generate-images.ts
 *
 * This script generates images for Nike creators based on their
 * visual match descriptions, creating contextually appropriate
 * content thumbnails.
 */

import { GoogleGenAI } from "@google/genai";
import { NIKE_CREATORS } from "../constants";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!API_KEY) {
  console.error("Error: GEMINI_API_KEY or API_KEY environment variable is required");
  console.error("Usage: GEMINI_API_KEY=your_key npx tsx scripts/generate-images.ts");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generate a prompt for the image based on creator data
 */
function buildImagePrompt(creator: typeof NIKE_CREATORS[0]): string {
  // Find the visual match for context
  const visualMatch = creator.matches.find(m => m.type === 'visual');
  const visualDescription = visualMatch?.excerpt || '';

  // Build a prompt that describes the scene
  const topicContext = creator.topics.join(', ');
  const locationContext = creator.location;

  // Create different prompts based on the content type
  let sceneDescription: string;

  if (visualDescription.toLowerCase().includes('basketball') ||
      visualDescription.toLowerCase().includes('jordan') ||
      visualDescription.toLowerCase().includes('hoops')) {
    sceneDescription = `Dynamic basketball content: athlete in motion on urban court, dramatic lighting, Nike basketball shoes visible, cinematic sports photography style`;
  } else if (visualDescription.toLowerCase().includes('running') ||
             visualDescription.toLowerCase().includes('marathon')) {
    sceneDescription = `Marathon runner in urban setting, early morning golden hour light, running shoes in motion, professional sports photography`;
  } else if (visualDescription.toLowerCase().includes('workout') ||
             visualDescription.toLowerCase().includes('training') ||
             visualDescription.toLowerCase().includes('crossfit')) {
    sceneDescription = `Intense gym workout scene, modern fitness studio, athlete training, dramatic gym lighting, fitness photography`;
  } else if (visualDescription.toLowerCase().includes('sneaker') ||
             visualDescription.toLowerCase().includes('dunk') ||
             visualDescription.toLowerCase().includes('collection')) {
    sceneDescription = `Sneaker collection display, aesthetic flat lay or shelf display, moody streetwear photography, clean product focus`;
  } else if (visualDescription.toLowerCase().includes('soccer') ||
             visualDescription.toLowerCase().includes('futbol') ||
             visualDescription.toLowerCase().includes('cleats')) {
    sceneDescription = `Soccer skills training on grass pitch, golden hour lighting, dynamic footwork shot, sports action photography`;
  } else if (visualDescription.toLowerCase().includes('fashion') ||
             visualDescription.toLowerCase().includes('streetwear') ||
             visualDescription.toLowerCase().includes('outfit')) {
    sceneDescription = `Urban streetwear fashion content, modern city backdrop, stylish outfit, editorial street photography`;
  } else {
    // Default athletic/lifestyle scene
    sceneDescription = `Athletic lifestyle content, ${topicContext.toLowerCase()}, modern aesthetic, professional content creator style`;
  }

  const prompt = `Create a vertical 9:16 social media content thumbnail image.
Scene: ${sceneDescription}
Style: High-quality social media content, authentic creator aesthetic, NOT stock photography.
Mood: Energetic, aspirational, youth culture.
Location vibe: ${locationContext}.
Important: No text overlays, no watermarks, photorealistic style.`;

  return prompt;
}

/**
 * Generate an image using Gemini
 */
async function generateImage(prompt: string, creatorId: string): Promise<string | null> {
  try {
    console.log(`  Generating image for ${creatorId}...`);

    // Use Gemini 2.0 Flash with image generation capability
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: prompt,
      config: {
        responseModalities: ['image', 'text'],
      }
    });

    // Extract image from response
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if ('inlineData' in part && part.inlineData) {
        const data = (part as any).inlineData;
        return `data:${data.mimeType};base64,${data.data}`;
      }
    }

    console.log(`  No image in response for ${creatorId}`);
    return null;
  } catch (error) {
    console.error(`  Error generating image for ${creatorId}:`, error);
    return null;
  }
}

/**
 * Save base64 image to file
 */
function saveImage(base64Data: string, filename: string): string {
  const outputDir = path.join(__dirname, '../public/generated');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Extract the actual base64 data (remove data:image/...;base64, prefix)
  const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid base64 image data');
  }

  const extension = matches[1];
  const data = matches[2];
  const filepath = path.join(outputDir, `${filename}.${extension}`);

  fs.writeFileSync(filepath, Buffer.from(data, 'base64'));

  return `/generated/${filename}.${extension}`;
}

async function main() {
  console.log('Nike Creator Image Generator');
  console.log('============================\n');

  const results: { id: string; name: string; prompt: string; imagePath?: string; error?: string }[] = [];

  for (const creator of NIKE_CREATORS) {
    console.log(`\nProcessing: ${creator.name} (${creator.handle})`);

    const prompt = buildImagePrompt(creator);
    console.log(`  Prompt: ${prompt.substring(0, 100)}...`);

    const imageData = await generateImage(prompt, creator.id);

    if (imageData) {
      try {
        const imagePath = saveImage(imageData, creator.id);
        console.log(`  Saved to: ${imagePath}`);
        results.push({ id: creator.id, name: creator.name, prompt, imagePath });
      } catch (saveError) {
        console.error(`  Error saving image:`, saveError);
        results.push({ id: creator.id, name: creator.name, prompt, error: String(saveError) });
      }
    } else {
      results.push({ id: creator.id, name: creator.name, prompt, error: 'No image generated' });
    }

    // Rate limiting - wait between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Output summary
  console.log('\n\n============================');
  console.log('Generation Summary');
  console.log('============================\n');

  const successful = results.filter(r => r.imagePath);
  const failed = results.filter(r => r.error);

  console.log(`Successful: ${successful.length}/${NIKE_CREATORS.length}`);
  console.log(`Failed: ${failed.length}/${NIKE_CREATORS.length}`);

  if (successful.length > 0) {
    console.log('\n--- Generated Images ---');
    successful.forEach(r => {
      console.log(`  ${r.name}: ${r.imagePath}`);
    });

    console.log('\n--- Update constants.ts ---');
    console.log('Replace thumbnail URLs with:');
    successful.forEach(r => {
      console.log(`  '${r.id}': '${r.imagePath}',`);
    });
  }

  if (failed.length > 0) {
    console.log('\n--- Failed ---');
    failed.forEach(r => {
      console.log(`  ${r.name}: ${r.error}`);
    });
  }
}

main().catch(console.error);
