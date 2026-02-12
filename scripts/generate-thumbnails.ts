/**
 * Generate Marcus Rivera post thumbnails using Gemini Imagen.
 * Run with: npx tsx scripts/generate-thumbnails.ts
 *
 * Requires VITE_GEMINI_API_KEY in .env.local
 */

import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Missing VITE_GEMINI_API_KEY. Set it in .env.local or environment.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'generated', 'marcus');

const PROMPTS: { id: string; prompt: string }[] = [
  // NIKE-HEAVY POSTS (1-4)
  { id: 'post-01', prompt: 'Instagram reel thumbnail: close-up of Nike Pegasus 41 running shoes on a dirt trail at golden hour, React foam midsole visible from side angle, Nike swoosh prominently featured, worn-in after 200 miles, vertical 9:16, professional product review photography' },
  { id: 'post-02', prompt: 'Instagram video thumbnail: group of athletes training together at Nike campus facility, Nike branding on walls and banners, all athletes wearing Nike gear, Nike swoosh banners everywhere, indoor training facility, vertical 9:16, professional documentary style photography' },
  { id: 'post-03', prompt: 'Instagram reel thumbnail: group of runners on a morning 5K run through Griffith Park at dawn, Nike Running Club banner at start line, runners wearing Nike Vaporfly shoes, Los Angeles hills in background, vertical 9:16, community running event photography' },
  { id: 'post-04', prompt: 'Instagram reel thumbnail: Nike Vomero 18 unboxing flat lay, brand new shoe emerging from Nike box with tissue paper, thick ZoomX midsole visible from side, close-up product detail on clean surface, vertical 9:16, clean unboxing product photography' },

  // NIKE-PRESENT POSTS (5-8)
  { id: 'post-05', prompt: 'Instagram reel thumbnail: man doing heavy bench press at Muscle Beach outdoor gym in Venice Beach, athletic training shoes and dri-fit shirt, ocean and palm trees visible in background, chest and shoulders workout, vertical 9:16, natural lighting fitness photography' },
  { id: 'post-06', prompt: 'Instagram post thumbnail: man running on a trail through Griffith Park at dawn, Los Angeles skyline visible in distance, wearing running shoes and shorts, 8-mile morning run, golden sunrise light filtering through trees, vertical 9:16, trail running photography' },
  { id: 'post-07', prompt: 'Instagram reel thumbnail: intense pickup basketball game at Venice Beach outdoor courts, players mid-action going for a layup, palm trees and sunset in background, concrete court, dynamic sports action shot, vertical 9:16' },
  { id: 'post-08', prompt: 'Instagram post thumbnail: overhead flat lay of three pairs of running shoes arranged neatly on wooden floor, Nike Pegasus alongside New Balance 1080 and ASICS Gel-Kayano, weekly rotation display, vertical 9:16, clean sneaker collection product photography' },

  // FITNESS/SPORTS POSTS (9-13)
  { id: 'post-09', prompt: 'Instagram reel thumbnail: man doing heavy 405-pound barbell back squat in a power rack, multiple plates loaded on bar, intense focused expression, dramatic gym lighting, leg day PR moment, vertical 9:16, fitness photography' },
  { id: 'post-10', prompt: 'Instagram reel thumbnail: man doing burpees mid-jump in minimalist gym space, full body HIIT workout, no equipment visible, athletic wear, high energy bodyweight exercise, sweat visible, vertical 9:16, dynamic fitness action photography' },
  { id: 'post-11', prompt: 'Instagram video thumbnail: two friends doing basketball dribbling skill drills on sunny outdoor court, one dribbling through cones while other watches, friendly competition vibes, vertical 9:16, casual sports photography' },
  { id: 'post-12', prompt: 'Instagram reel thumbnail: overhead view of 5 identical meal prep containers on kitchen counter, each with grilled chicken breast plus white rice plus steamed broccoli, clean eating Sunday prep, meal prep aesthetic, vertical 9:16, food photography' },
  { id: 'post-13', prompt: 'Instagram video thumbnail: fit man standing in gym explaining training tips, pointing toward camera, motivational trainer energy, gym equipment and mirrors in background, personal trainer coaching aesthetic, vertical 9:16, fitness coaching photography' },

  // LIFESTYLE POSTS (14-17)
  { id: 'post-14', prompt: 'Instagram story thumbnail: NBA Lakers basketball game seen from arena stands at Crypto.com Arena, purple and gold crowd decorations, bright court lights below, electric packed arena atmosphere, game night energy, vertical 9:16, sports event photography' },
  { id: 'post-15', prompt: 'Instagram post thumbnail: artisan pour-over coffee being prepared at trendy cafe, beautiful latte art on ceramic cup, warm amber lighting, minimalist Silver Lake Los Angeles coffee shop interior with exposed brick, vertical 9:16, cozy cafe photography' },
  { id: 'post-16', prompt: 'Instagram reel thumbnail: man hiking on coastal Malibu trail at golden sunset with Pacific Ocean view below, dramatic coastal cliffs and wildflowers, warm golden hour light, nature therapy vibes, vertical 9:16, landscape hiking photography' },
  { id: 'post-17', prompt: 'Instagram video thumbnail: birria tacos with rich red consomme dipping sauce on a street food table, downtown Los Angeles buildings visible in background, vibrant colorful Mexican street food spread with lime and cilantro, vertical 9:16, food tour photography' },

  // PERSONAL POSTS (18-20)
  { id: 'post-18', prompt: 'Instagram reel thumbnail: birthday celebration scene with friends gathered around table, cake with lit candles as centerpiece, warm ambient party string lights, group of diverse friends smiling and celebrating, turning 28 vibes, vertical 9:16' },
  { id: 'post-19', prompt: 'Instagram video thumbnail: modern minimalist apartment living room tour in West Hollywood, clean white walls, indoor plants, small home gym equipment corner, large windows with bright LA sunlight, fitness guy aesthetic interior, vertical 9:16, interior design photography' },
  { id: 'post-20', prompt: 'Instagram story thumbnail: man sitting casually in front of camera for Q&A session, ring light reflection visible, home vlog setup with clean background, talking directly to camera, answering fan questions about training and life in LA, vertical 9:16, vlog style' },
];

async function generateImage(prompt: string): Promise<Buffer | null> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: prompt,
      config: { responseModalities: ['image'] },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && 'inlineData' in part) {
      const data = (part as { inlineData: { data: string } }).inlineData.data;
      return Buffer.from(data, 'base64');
    }
    return null;
  } catch (err) {
    console.error('Generation failed:', err);
    return null;
  }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const { id, prompt } of PROMPTS) {
    const outPath = path.join(OUTPUT_DIR, `${id}.jpeg`);
    if (fs.existsSync(outPath)) {
      console.log(`[skip] ${id} already exists`);
      continue;
    }

    console.log(`[gen] ${id}...`);
    const buf = await generateImage(prompt);
    if (buf) {
      fs.writeFileSync(outPath, buf);
      console.log(`[ok] ${id} saved (${(buf.length / 1024).toFixed(0)}KB)`);
    } else {
      console.log(`[fail] ${id} — no image returned`);
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('Done!');
}

main();
