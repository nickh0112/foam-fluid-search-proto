#!/usr/bin/env node

/**
 * Gemini 3 Pro Image Generation Script - Coffee Creators
 * Generates thumbnails and avatars for coffee influencer creators
 *
 * Usage: GEMINI_API_KEY=AIzaSy... node scripts/generate-coffee-images.js
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.0-flash-exp-image-generation';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// Output directories
const GENERATED_DIR = path.join(__dirname, '../public/generated');
const AVATARS_DIR = path.join(__dirname, '../public/avatars');

// Coffee creator thumbnails (9:16 vertical format for social media)
const COFFEE_THUMBNAILS = [
  {
    filename: 'coffee1.jpeg',
    prompt: 'Professional barista creating intricate latte art in a rosetta pattern, close-up shot of espresso cup with milk being poured, steam rising, modern cafe setting, warm golden lighting, professional coffee photography, 9:16 vertical aspect ratio, high quality',
  },
  {
    filename: 'coffee2.jpeg',
    prompt: 'Cold brew coffee preparation scene, mason jars filled with dark cold brew concentrate, coffee beans scattered on wooden surface, ice cubes, modern kitchen setting, bright natural lighting, lifestyle photography, 9:16 vertical aspect ratio, high quality',
  },
  {
    filename: 'coffee3.jpeg',
    prompt: 'Ceremonial matcha preparation, bamboo whisk whisking bright green matcha in traditional bowl, zen aesthetic, minimalist setting, soft natural lighting, Japanese tea ceremony inspired, aesthetic photography, 9:16 vertical aspect ratio, high quality',
  },
  {
    filename: 'coffee4.jpeg',
    prompt: 'Pour over coffee brewing scene, Chemex glass carafe with coffee dripping, gooseneck kettle pouring water in circular motion, modern home kitchen, morning sunlight streaming through window, lifestyle photography, 9:16 vertical aspect ratio, high quality',
  },
  {
    filename: 'coffee5.jpeg',
    prompt: 'Aesthetic specialty coffee shop interior, cappuccino in ceramic cup on marble table, plants and warm wood accents, cozy cafe atmosphere, soft ambient lighting, travel photography style, 9:16 vertical aspect ratio, high quality',
  },
  {
    filename: 'coffee6.jpeg',
    prompt: 'Espresso shot being pulled from professional machine, crema forming on top, close-up detail shot, modern cafe bar setting, dramatic lighting highlighting the golden crema, coffee photography, 9:16 vertical aspect ratio, high quality',
  },
  {
    filename: 'coffee7.jpeg',
    prompt: 'Cozy morning routine scene, person holding warm coffee mug by window, sunrise visible outside, peaceful lifestyle aesthetic, soft warm lighting, mindfulness and slow living vibes, lifestyle photography, 9:16 vertical aspect ratio, high quality',
  },
];

// Coffee creator avatars
const COFFEE_AVATARS = [
  {
    filename: 'coffee1.jpg',
    prompt: 'Professional headshot portrait of a young Korean woman barista in her late 20s, confident smile, cafe background blurred, wearing apron, warm natural lighting, coffee influencer aesthetic, square crop, high quality photography',
  },
  {
    filename: 'coffee2.jpg',
    prompt: 'Professional headshot portrait of a friendly Latino man in his early 30s, casual smile, kitchen background blurred, relaxed lifestyle influencer vibe, natural lighting, food content creator aesthetic, square crop, high quality photography',
  },
  {
    filename: 'coffee3.jpg',
    prompt: 'Professional headshot portrait of a stylish Asian woman in her mid-20s, serene expression, minimalist background, wellness influencer aesthetic, soft natural lighting, matcha and tea creator vibe, square crop, high quality photography',
  },
  {
    filename: 'coffee4.jpg',
    prompt: 'Professional headshot portrait of a bearded man in his early 30s with glasses, thoughtful smile, modern home background blurred, coffee geek aesthetic, natural lighting, educational creator vibe, square crop, high quality photography',
  },
  {
    filename: 'coffee5.jpg',
    prompt: 'Professional headshot portrait of a stylish woman in her late 20s with curly hair, warm genuine smile, travel aesthetic background, cafe hopper vibe, natural lighting, travel content creator portrait, square crop, high quality photography',
  },
  {
    filename: 'coffee6.jpg',
    prompt: 'Professional headshot portrait of a charismatic Black man in his late 20s, energetic smile, urban background blurred, food critic aesthetic, dynamic lighting, TikTok creator vibe, square crop, high quality photography',
  },
  {
    filename: 'coffee7.jpg',
    prompt: 'Professional headshot portrait of a warm woman in her early 30s with blonde wavy hair, soft smile, cozy home background, lifestyle influencer aesthetic, morning golden light, wellness creator vibe, square crop, high quality photography',
  },
];

// Delay helper for rate limiting
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate a single image using Gemini API
async function generateImage(prompt, outputPath) {
  if (!API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  console.log(`\nGenerating: ${path.basename(outputPath)}`);
  console.log(`Prompt: ${prompt.substring(0, 80)}...`);

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'x-goog-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          responseModalities: ['IMAGE', 'TEXT'],
          temperature: 1.0,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    // Find the image part in the response
    const candidates = data.candidates || [];
    if (candidates.length === 0) {
      throw new Error('No candidates in response');
    }

    const parts = candidates[0].content?.parts || [];
    const imagePart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));

    if (!imagePart) {
      console.log('Response parts:', JSON.stringify(parts.map(p => Object.keys(p)), null, 2));
      throw new Error('No image data in response');
    }

    const imageBase64 = imagePart.inlineData.data;
    const imageBuffer = Buffer.from(imageBase64, 'base64');

    // Write the image file
    fs.writeFileSync(outputPath, imageBuffer);
    console.log(`Saved: ${outputPath} (${(imageBuffer.length / 1024).toFixed(1)} KB)`);

    return true;
  } catch (error) {
    console.error(`Failed: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  console.log('='.repeat(60));
  console.log('Coffee Creators Image Generation');
  console.log('='.repeat(60));

  if (!API_KEY) {
    console.error('\nError: GEMINI_API_KEY environment variable is required');
    console.log('\nUsage: GEMINI_API_KEY=AIzaSy... node scripts/generate-coffee-images.js');
    process.exit(1);
  }

  // Ensure directories exist
  [GENERATED_DIR, AVATARS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });

  let successCount = 0;
  let failCount = 0;

  // Generate thumbnails
  console.log('\n--- Generating Coffee Thumbnails ---');
  for (const thumbnail of COFFEE_THUMBNAILS) {
    const outputPath = path.join(GENERATED_DIR, thumbnail.filename);
    const success = await generateImage(thumbnail.prompt, outputPath);
    if (success) successCount++;
    else failCount++;

    // Rate limiting: wait 3 seconds between requests
    await delay(3000);
  }

  // Generate avatars
  console.log('\n--- Generating Coffee Avatars ---');
  for (const avatar of COFFEE_AVATARS) {
    const outputPath = path.join(AVATARS_DIR, avatar.filename);
    const success = await generateImage(avatar.prompt, outputPath);
    if (success) successCount++;
    else failCount++;

    // Rate limiting: wait 3 seconds between requests
    await delay(3000);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Generation Complete');
  console.log('='.repeat(60));
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Total: ${successCount + failCount}`);

  if (failCount > 0) {
    console.log('\nNote: Failed images can use placeholder fallbacks.');
    console.log('The app will gracefully handle missing images.');
  }

  process.exit(failCount > 0 ? 1 : 0);
}

// Run
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
