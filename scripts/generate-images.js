#!/usr/bin/env node

/**
 * Gemini 3 Pro Image Generation Script
 * Generates thumbnails and avatars for the foam.io Unified Search prototype
 *
 * Usage: GEMINI_API_KEY=AIzaSy... node scripts/generate-images.js
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.0-flash-exp-image-generation';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// Output directories
const THUMBNAILS_DIR = path.join(__dirname, '../public/thumbnails');
const AVATARS_DIR = path.join(__dirname, '../public/avatars');

// Image generation prompts
const THUMBNAILS = [
  {
    filename: 'sarah-cooking.jpg',
    prompt: 'Professional kitchen scene, person cooking pasta at stove, camera angle from side showing their feet wearing bright yellow Crocs clogs, warm lighting, lifestyle photography, high quality, 16:9 aspect ratio, clean modern kitchen with stainless steel appliances',
  },
  {
    filename: 'mike-gym.jpg',
    prompt: 'Gym interior, person sitting on weight bench taking a break, Crocs Classic Clogs visible on floor near gym bag, modern fitness center with weight equipment, natural lighting through windows, lifestyle photography, 16:9 aspect ratio',
  },
  {
    filename: 'laura-lifestyle.jpg',
    prompt: 'Cozy living room scene, person relaxing on white sofa with coffee cup in hand, colorful pink Crocs clogs visible on feet, soft natural lighting from large windows, lifestyle influencer aesthetic, minimalist modern decor, 16:9 aspect ratio',
  },
  {
    filename: 'jenna-baking.jpg',
    prompt: 'Cozy home baking scene, kitchen counter with fresh chocolate chip cookies cooling on rack, mixing bowls and baking supplies visible, soft warm lighting, no shoes visible in frame, lifestyle photography, rustic farmhouse kitchen style, 16:9 aspect ratio',
  },
  {
    filename: 'alex-outdoors.jpg',
    prompt: 'Outdoor hiking scene, person taking break on mountain trail sitting on rock, backpack and hiking gear visible, scenic mountain background with trees, adventure lifestyle photography, golden hour lighting, 16:9 aspect ratio',
  },
];

const AVATARS = [
  {
    filename: 'sarah.jpg',
    prompt: 'Professional headshot portrait of a friendly Asian woman in her late 20s, warm genuine smile, kitchen background slightly blurred, natural soft lighting, influencer style portrait, clean minimal background, square crop, high quality photography',
  },
  {
    filename: 'mike.jpg',
    prompt: 'Professional headshot portrait of an athletic Latino man in his early 30s, confident friendly smile, gym setting background blurred, natural lighting, fitness influencer portrait, wearing workout shirt, square crop, high quality photography',
  },
  {
    filename: 'laura.jpg',
    prompt: 'Professional headshot portrait of a stylish woman in her mid-20s with brown hair, genuine warm smile, lifestyle aesthetic with neutral background slightly blurred, soft natural lighting, influencer portrait style, square crop, high quality photography',
  },
  {
    filename: 'jenna.jpg',
    prompt: 'Professional headshot portrait of a cheerful woman in her late 20s with blonde hair, warm friendly expression, kitchen background blurred, soft natural lighting, food blogger portrait style, wearing casual apron, square crop, high quality photography',
  },
  {
    filename: 'alex.jpg',
    prompt: 'Professional headshot portrait of an adventurous man in his early 30s with short brown hair, relaxed confident smile, outdoor nature background blurred with trees, natural lighting, adventure influencer portrait, square crop, high quality photography',
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
    console.log(`✓ Saved: ${outputPath} (${(imageBuffer.length / 1024).toFixed(1)} KB)`);

    return true;
  } catch (error) {
    console.error(`✗ Failed: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  console.log('='.repeat(60));
  console.log('Gemini 3 Pro Image Generation');
  console.log('='.repeat(60));

  if (!API_KEY) {
    console.error('\nError: GEMINI_API_KEY environment variable is required');
    console.log('\nUsage: GEMINI_API_KEY=AIzaSy... node scripts/generate-images.js');
    process.exit(1);
  }

  // Ensure directories exist
  [THUMBNAILS_DIR, AVATARS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });

  let successCount = 0;
  let failCount = 0;

  // Generate thumbnails
  console.log('\n--- Generating Thumbnails ---');
  for (const thumbnail of THUMBNAILS) {
    const outputPath = path.join(THUMBNAILS_DIR, thumbnail.filename);
    const success = await generateImage(thumbnail.prompt, outputPath);
    if (success) successCount++;
    else failCount++;

    // Rate limiting: wait 3 seconds between requests
    await delay(3000);
  }

  // Generate avatars
  console.log('\n--- Generating Avatars ---');
  for (const avatar of AVATARS) {
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
  console.log(`✓ Successful: ${successCount}`);
  console.log(`✗ Failed: ${failCount}`);
  console.log(`Total: ${successCount + failCount}`);

  if (failCount > 0) {
    console.log('\nNote: Failed images can use Unsplash fallbacks:');
    console.log('- Thumbnails: https://source.unsplash.com/800x450/?kitchen,cooking');
    console.log('- Avatars: https://source.unsplash.com/200x200/?portrait,professional');
  }

  process.exit(failCount > 0 ? 1 : 0);
}

// Run
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
