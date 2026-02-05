/**
 * Generate contextual coffee creator images using Gemini
 *
 * Usage: GEMINI_API_KEY=your_key npx tsx scripts/generate-coffee-images.ts
 *
 * This script generates images for Coffee creators based on their
 * visual match descriptions, creating contextually appropriate
 * content thumbnails and avatars.
 */

import { GoogleGenAI } from "@google/genai";
import { COFFEE_CREATORS } from "../constants";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!API_KEY) {
  console.error("Error: GEMINI_API_KEY or API_KEY environment variable is required");
  console.error("Usage: GEMINI_API_KEY=your_key npx tsx scripts/generate-coffee-images.ts");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generate a prompt for the thumbnail image based on creator data
 */
function buildThumbnailPrompt(creator: typeof COFFEE_CREATORS[0]): string {
  // Find the visual match for context
  const visualMatch = creator.matches.find(m => m.type === 'visual');
  const visualDescription = visualMatch?.excerpt || '';
  const topicContext = creator.topics.join(', ');
  const locationContext = creator.location;

  let sceneDescription: string;

  if (creator.id === 'coffee1') {
    // Barista Ben - Espresso/Latte Art
    sceneDescription = `Professional barista creating intricate latte art, rosetta pattern forming in coffee cup, steam rising, warm cafe lighting, close-up hands and cup composition`;
  } else if (creator.id === 'coffee2') {
    // Cold Brew Carly
    sceneDescription = `Aesthetic cold brew coffee being poured over ice in tall glass, slow pour moment, condensation on glass, bright natural lighting, summer vibes`;
  } else if (creator.id === 'coffee3') {
    // Matcha Maya
    sceneDescription = `Beautiful matcha latte in ceramic cup with latte art, minimalist setting, natural lighting through window, zen wellness aesthetic`;
  } else if (creator.id === 'coffee4') {
    // Brew Master Mike - Home Brewing
    sceneDescription = `Pour over coffee brewing setup, V60 or Chemex with coffee dripping, gooseneck kettle pouring, morning light, detailed brewing process`;
  } else if (creator.id === 'coffee5') {
    // Cafe Wanderer
    sceneDescription = `Cozy independent coffee shop interior, exposed brick, vintage decor, coffee cup on rustic wooden table, warm ambient lighting`;
  } else if (creator.id === 'coffee6') {
    // Espresso Eddie
    sceneDescription = `Perfect espresso shot pulling from machine, rich crema forming, dramatic lighting, coffee shop counter, barista perspective`;
  } else if (creator.id === 'coffee7') {
    // Morning Ritual Rachel
    sceneDescription = `Sunrise coffee moment on balcony with mountain view, steaming cup held in hands, golden hour light, peaceful morning atmosphere`;
  } else {
    // Default coffee scene
    sceneDescription = `Beautiful coffee content, ${topicContext.toLowerCase()}, modern aesthetic, professional content creator style`;
  }

  const prompt = `Create a vertical 9:16 social media content thumbnail image.
Scene: ${sceneDescription}
Style: High-quality social media content, authentic creator aesthetic, warm coffee tones, NOT stock photography.
Mood: Cozy, aspirational, coffee culture vibes.
Location vibe: ${locationContext}.
Important: No text overlays, no watermarks, photorealistic style, focus on coffee and atmosphere.`;

  return prompt;
}

/**
 * Generate a prompt for the avatar image
 */
function buildAvatarPrompt(creator: typeof COFFEE_CREATORS[0]): string {
  const genderContext = creator.gender === 'Male' ? 'man' : 'woman';

  let styleDescription: string;

  if (creator.id === 'coffee1') {
    styleDescription = `Professional barista ${genderContext}, early 30s, friendly smile, wearing apron, coffee shop background blur`;
  } else if (creator.id === 'coffee2') {
    styleDescription = `Trendy young ${genderContext}, mid 20s, casual style, holding iced coffee, bright personality`;
  } else if (creator.id === 'coffee3') {
    styleDescription = `Wellness-focused ${genderContext}, serene expression, natural makeup, holding matcha, minimal aesthetic`;
  } else if (creator.id === 'coffee4') {
    styleDescription = `Thoughtful ${genderContext}, late 20s, casual smart, home kitchen background, coffee enthusiast vibe`;
  } else if (creator.id === 'coffee5') {
    styleDescription = `Creative ${genderContext}, artistic style, cafe setting, warm smile, explorer personality`;
  } else if (creator.id === 'coffee6') {
    styleDescription = `Energetic ${genderContext}, mid 20s, expressive face, coffee shop counter, reviewer personality`;
  } else if (creator.id === 'coffee7') {
    styleDescription = `Peaceful ${genderContext}, morning glow, natural look, cozy sweater, wellness influencer aesthetic`;
  } else {
    styleDescription = `Friendly coffee enthusiast ${genderContext}, warm smile, casual style`;
  }

  const prompt = `Create a profile picture/avatar image, square format.
Subject: ${styleDescription}
Style: Professional social media profile photo, warm lighting, shallow depth of field, authentic not overly polished.
Composition: Head and shoulders, looking at camera, approachable expression.
Important: No text, photorealistic, natural colors.`;

  return prompt;
}

/**
 * Generate an image using Gemini
 */
async function generateImage(prompt: string, label: string): Promise<string | null> {
  try {
    console.log(`  Generating ${label}...`);

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: prompt,
      config: {
        responseModalities: ['image', 'text'],
      }
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if ('inlineData' in part && part.inlineData) {
        const data = (part as any).inlineData;
        return `data:${data.mimeType};base64,${data.data}`;
      }
    }

    console.log(`  No image in response for ${label}`);
    return null;
  } catch (error) {
    console.error(`  Error generating ${label}:`, error);
    return null;
  }
}

/**
 * Save base64 image to file
 */
function saveImage(base64Data: string, filename: string, subdir: string = 'generated'): string {
  const outputDir = path.join(__dirname, `../public/${subdir}`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid base64 image data');
  }

  const extension = matches[1] === 'jpeg' ? 'jpeg' : matches[1];
  const data = matches[2];
  const filepath = path.join(outputDir, `${filename}.${extension}`);

  fs.writeFileSync(filepath, Buffer.from(data, 'base64'));

  return `/${subdir}/${filename}.${extension}`;
}

async function main() {
  console.log('Coffee Creator Image Generator');
  console.log('==============================\n');

  const results: {
    id: string;
    name: string;
    thumbnailPath?: string;
    avatarPath?: string;
    errors: string[];
  }[] = [];

  for (const creator of COFFEE_CREATORS) {
    console.log(`\nProcessing: ${creator.name} (${creator.handle})`);

    const result: typeof results[0] = {
      id: creator.id,
      name: creator.name,
      errors: []
    };

    // Generate thumbnail
    const thumbnailPrompt = buildThumbnailPrompt(creator);
    console.log(`  Thumbnail prompt: ${thumbnailPrompt.substring(0, 80)}...`);

    const thumbnailData = await generateImage(thumbnailPrompt, `${creator.id} thumbnail`);
    if (thumbnailData) {
      try {
        result.thumbnailPath = saveImage(thumbnailData, creator.id, 'generated');
        console.log(`  Thumbnail saved to: ${result.thumbnailPath}`);
      } catch (err) {
        result.errors.push(`Thumbnail save error: ${err}`);
      }
    } else {
      result.errors.push('No thumbnail generated');
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate avatar
    const avatarPrompt = buildAvatarPrompt(creator);
    console.log(`  Avatar prompt: ${avatarPrompt.substring(0, 80)}...`);

    const avatarData = await generateImage(avatarPrompt, `${creator.id} avatar`);
    if (avatarData) {
      try {
        result.avatarPath = saveImage(avatarData, creator.id, 'avatars');
        console.log(`  Avatar saved to: ${result.avatarPath}`);
      } catch (err) {
        result.errors.push(`Avatar save error: ${err}`);
      }
    } else {
      result.errors.push('No avatar generated');
    }

    results.push(result);

    // Rate limiting between creators
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Output summary
  console.log('\n\n==============================');
  console.log('Generation Summary');
  console.log('==============================\n');

  const successfulThumbnails = results.filter(r => r.thumbnailPath);
  const successfulAvatars = results.filter(r => r.avatarPath);
  const withErrors = results.filter(r => r.errors.length > 0);

  console.log(`Thumbnails: ${successfulThumbnails.length}/${COFFEE_CREATORS.length}`);
  console.log(`Avatars: ${successfulAvatars.length}/${COFFEE_CREATORS.length}`);

  if (successfulThumbnails.length > 0 || successfulAvatars.length > 0) {
    console.log('\n--- Generated Images ---');
    results.forEach(r => {
      console.log(`  ${r.name}:`);
      if (r.thumbnailPath) console.log(`    thumbnail: ${r.thumbnailPath}`);
      if (r.avatarPath) console.log(`    avatar: ${r.avatarPath}`);
    });
  }

  if (withErrors.length > 0) {
    console.log('\n--- Errors ---');
    withErrors.forEach(r => {
      console.log(`  ${r.name}: ${r.errors.join(', ')}`);
    });
  }

  console.log('\n--- constants.ts paths are already configured ---');
  console.log('Thumbnails: /generated/coffee1-7.jpeg');
  console.log('Avatars: /avatars/coffee1-7.jpg');
}

main().catch(console.error);
