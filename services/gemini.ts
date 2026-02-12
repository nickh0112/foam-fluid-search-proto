import { GoogleGenAI, Type } from "@google/genai";
import { QueryNode, DockItem, PostDockItem, SemanticFilter, ParsedQueryResult, ParsedPostFilterResult, CreatorPost } from "../types";

// In a real app, this would be initialized properly.
// Uses VITE_GEMINI_API_KEY from environment (Vite requires VITE_ prefix)
const getAI = () => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const modelName = "gemini-3-flash-preview";

// System instruction to guide Gemini to output correct JSON for our Logic Stream
const SYSTEM_INSTRUCTION = `
You are a query parser for a talent discovery engine called "Foam Fluid".
Your goal is to translate natural language user input into a Structured Query Node.

The system uses a logic tree.
- ROOT: The starting point.
- AND: Narrows the previous results (e.g., "only men", "coffee").
- OR: Adds a new branch to the results (e.g., "also women in NY").
- NOT: Excludes results.

Output JSON Format:
{
  "operator": "ROOT" | "AND" | "OR" | "NOT",
  "description": "Short 2-3 word summary for UI display",
  "filters": {
    "gender": "Male" | "Female" | "Non-binary" | null,
    "location": string | null,
    "topics": string[] | null, // Array of topics if mentioned
    "platform": "TikTok" | "Instagram" | "YouTube" | null,
    "minFollowers": number | null,
    "minEngagement": number | null // Percentage value (e.g. 5 for 5%)
  },
  "semanticFilters": [
    { "type": "visual" | "audio" | "context" | "notes", "label": "Short label", "description": "What we're looking for" }
  ]
}

For semanticFilters, break down the user's query into distinct searchable aspects:
- "visual": Things we can detect visually in video content (products, brands, settings, activities)
- "audio": Things we can detect from speech/audio (brand mentions, keywords spoken)
- "context": Contextual requirements (timing, setting, activity type)
- "notes": Creator metadata or notes (partnership status, prior collaborations)

Example: "Creators who authentically feature Nike products during fitness content"
semanticFilters: [
  { "type": "visual", "label": "Nike Products", "description": "Nike products detected in video" },
  { "type": "audio", "label": "Brand Mentions", "description": "Positive/natural brand mentions" },
  { "type": "context", "label": "Fitness Context", "description": "During workout/training" },
  { "type": "notes", "label": "Partnership Status", "description": "Not already partnered" }
]

Example 2: Simple query "Coffee"
semanticFilters: [
  { "type": "visual", "label": "Coffee Content", "description": "Coffee, cafes, or brewing visible in videos" },
  { "type": "audio", "label": "Coffee Discussion", "description": "Mentions coffee, cafes, or coffee culture" },
  { "type": "context", "label": "Lifestyle Context", "description": "Morning routines, productivity, or cafe visits" },
  { "type": "notes", "label": "Niche Alignment", "description": "Consistent coffee/lifestyle content creator" }
]

Rules:
1. If this is the FIRST query (ROOT context), use "ROOT".
2. If this is a FOLLOW-UP query (context exists):
   - If the user types a simple topic or attribute (e.g., "Coffee", "Basketball", "Male"), treat it as a refinement ("AND"). Do NOT create a new ROOT unless the user explicitly says "Start over" or "New search".
   - If the user says "only", "limit to", "just", use "AND".
   - If the user says "also", "add", "include", use "OR".
   - If the user says "except", "no", "remove", use "NOT".
3. Extract entities for location (e.g. "NY" -> "New York"), gender, platform.
4. ALWAYS generate exactly 4 semanticFilters, even for simple queries. Infer reasonable aspects:
   - For simple topic queries (e.g., "Coffee"), imagine a brand searching for creators:
     - visual: The topic visible in content (e.g., "Coffee Products", "Coffee drinking/making")
     - audio: Related spoken content (e.g., "Coffee discussion", "Cafe mentions")
     - context: Likely content context (e.g., "Morning routine", "Lifestyle content")
     - notes: Relevant creator attributes (e.g., "Content consistency", "Audience demographics")
5. Return purely JSON.
`;

export const parseUserQuery = async (input: string, isFirstQuery: boolean): Promise<ParsedQueryResult> => {
  try {
    const ai = getAI();
    
    const contextPrompt = isFirstQuery 
      ? `This is the FIRST query. Treat it as a ROOT search.`
      : `This is a follow-up query to an existing list. default to 'AND' if it is a refinement or a topic addition.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: `${contextPrompt} User Input: "${input}"`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            operator: { type: Type.STRING, enum: ["ROOT", "AND", "OR", "NOT"] },
            description: { type: Type.STRING },
            filters: {
              type: Type.OBJECT,
              properties: {
                gender: { type: Type.STRING, nullable: true },
                location: { type: Type.STRING, nullable: true },
                platform: { type: Type.STRING, nullable: true },
                minFollowers: { type: Type.NUMBER, nullable: true },
                minEngagement: { type: Type.NUMBER, nullable: true },
                topics: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true }
              }
            },
            semanticFilters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["visual", "audio", "context", "notes"] },
                  label: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              },
              nullable: true
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Parse Error:", error);
    // Fallback for demo purposes if API fails or key missing
    return {
      operator: isFirstQuery ? 'ROOT' : 'AND',
      description: input,
      filters: { topics: [input] }
    };
  }
};

/**
 * Generate creator images using Gemini 3 Pro
 * Falls back to placeholder if generation fails
 */
export const generateCreatorImage = async (
  prompt: string,
  aspectRatio: '1:1' | '9:16' = '9:16'
): Promise<string> => {
  try {
    const ai = getAI();

    // Use Gemini's image generation capability
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro', // Gemini 3 Pro for image generation
      contents: prompt,
      config: {
        // Request image generation
        responseModalities: ['image'],
      }
    });

    // Extract base64 image from response
    const imageData = response.candidates?.[0]?.content?.parts?.[0];
    if (imageData && 'inlineData' in imageData) {
      const base64 = (imageData as { inlineData: { data: string; mimeType: string } }).inlineData.data;
      const mimeType = (imageData as { inlineData: { data: string; mimeType: string } }).inlineData.mimeType;
      return `data:${mimeType};base64,${base64}`;
    }

    // Fallback to Unsplash placeholder
    const size = aspectRatio === '1:1' ? '100/100' : '400/600';
    return `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=${size.split('/')[0]}&h=${size.split('/')[1]}&fit=crop`;
  } catch (error) {
    console.error("Image Generation Error:", error);
    // Fallback to Unsplash placeholder
    const size = aspectRatio === '1:1' ? '100/100' : '400/600';
    return `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=${size.split('/')[0]}&h=${size.split('/')[1]}&fit=crop`;
  }
};

/**
 * Generate a tailored "Why They Qualify" rationale for a creator
 * Combines the search query with the evidence/matches found
 */
export const generateCreatorRationale = async (
  searchQuery: string,
  creatorName: string,
  matches: Array<{ type: string; excerpt: string; timestamp?: string }>,
  brandAffinity?: { partnership?: string; mentionFrequency: string }
): Promise<string> => {
  try {
    const ai = getAI();

    const evidenceList = matches.map(m => {
      const typeLabel = m.type === 'visual' ? 'Visual' :
                        m.type === 'audio' ? 'Audio' :
                        m.type === 'caption' ? 'Caption' : 'Note';
      return `- ${typeLabel}: "${m.excerpt}"${m.timestamp ? ` (at ${m.timestamp})` : ''}`;
    }).join('\n');

    const affinityInfo = brandAffinity
      ? `\nBrand relationship: ${brandAffinity.partnership || 'None'}, Mention frequency: ${brandAffinity.mentionFrequency}`
      : '';

    const prompt = `You are writing a brief "Why They Qualify" summary for a talent discovery platform.

Search query: "${searchQuery}"
Creator: ${creatorName}

Evidence found in their content:
${evidenceList}
${affinityInfo}

Write 2-3 sentences explaining why this creator is a great match for this specific search. Be specific - reference the actual evidence. Keep it concise and compelling. Don't use generic phrases. Focus on what makes THIS creator uniquely qualified for THIS search.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    return response.text || "This creator matches your search criteria.";
  } catch (error) {
    console.error("Rationale Generation Error:", error);
    // Fallback
    return `${creatorName} matches your search for "${searchQuery}" based on authentic content featuring the brand.`;
  }
};

/**
 * Generate a "Why This Matches" rationale for a specific post
 * Uses the post's signals and caption to explain relevance to the search
 */
export const generatePostRationale = async (
  searchTerm: string,
  creatorName: string,
  post: CreatorPost
): Promise<string> => {
  try {
    const ai = getAI();

    const evidenceList = post.signals.map(s => {
      const typeLabel = s.type === 'visual' ? 'Visual' :
                        s.type === 'audio' ? 'Audio' :
                        s.type === 'caption' ? 'Caption' : 'Note';
      return `- ${typeLabel}: "${s.excerpt}"${s.timestamp ? ` (at ${s.timestamp})` : ''}`;
    }).join('\n');

    const captionSnippet = post.caption.length > 200
      ? post.caption.slice(0, 200) + '...'
      : post.caption;

    const prompt = `You are writing a brief "Why This Matches" summary for a post on a talent discovery platform.

Search query: "${searchTerm}"
Creator: ${creatorName}
Post caption: "${captionSnippet}"

Evidence found in this post:
${evidenceList}

Write 2-3 sentences explaining why this post matches the search. Be specific - reference the actual evidence. Keep it concise and compelling. Focus on what makes THIS post relevant to THIS search.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    return response.text || `This post matches your search for "${searchTerm}".`;
  } catch (error) {
    console.error("Post Rationale Generation Error:", error);
    return `This post matches your search for "${searchTerm}".`;
  }
};

// --- Post Query Parser (Account Posts Mode) ---

const POST_QUERY_SYSTEM_INSTRUCTION = `
You are a query parser for filtering a creator's posts on a talent discovery platform.
Your goal is to translate natural language user input into structured filter parameters.

The posts have:
- contentType: "Reel" | "Story" | "Post" | "Video" | "Paid"
- signals with types: "visual" | "audio" | "caption"
- stats: views, likes, comments, shares
- postedAt date
- caption text

Output JSON Format:
{
  "filters": {
    "contentTypes": string[] | [],
    "signalTypes": string[] | [],
    "minViews": number | null,
    "minLikes": number | null,
    "dateFrom": string | null,
    "dateTo": string | null,
    "searchTerm": string | null
  },
  "sortBy": "composite" | "signals" | "engagement" | "recency" | null
}

Rules:
1. Map content type references: "reels" → ["Reel"], "stories" → ["Story"], "videos" → ["Video"], "posts" → ["Post"]
2. Map signal type references: "audio signals" → ["audio"], "visual" → ["visual"], "caption" → ["caption"]
3. Convert engagement numbers: "100k views" → minViews: 100000, "50k likes" → minLikes: 50000
4. For date ranges: "last 30 days" → dateFrom as ISO string 30 days ago, "last week" → 7 days ago
5. For brand/topic mentions (e.g. "nike", "coffee"), use searchTerm
6. If the query suggests a sort preference (e.g. "most viewed", "newest"), set sortBy accordingly
7. If the input doesn't match any structured filter, treat the entire input as searchTerm
8. Return empty arrays for contentTypes/signalTypes when not specified (means show all)

Examples:
- "reels with audio signals" → { contentTypes: ["Reel"], signalTypes: ["audio"] }
- "posts with over 100k views" → { minViews: 100000 }
- "nike" → { searchTerm: "nike" }
- "most engaged reels" → { contentTypes: ["Reel"], sortBy: "engagement" }
- "recent posts with visual signals" → { signalTypes: ["visual"], sortBy: "recency" }
`;

export const parsePostQuery = async (input: string): Promise<ParsedPostFilterResult> => {
  try {
    const ai = getAI();

    const response = await Promise.race([
      ai.models.generateContent({
        model: modelName,
        contents: `User Input: "${input}"`,
        config: {
          systemInstruction: POST_QUERY_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              filters: {
                type: Type.OBJECT,
                properties: {
                  contentTypes: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
                  signalTypes: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
                  minViews: { type: Type.NUMBER, nullable: true },
                  minLikes: { type: Type.NUMBER, nullable: true },
                  dateFrom: { type: Type.STRING, nullable: true },
                  dateTo: { type: Type.STRING, nullable: true },
                  searchTerm: { type: Type.STRING, nullable: true },
                },
              },
              sortBy: { type: Type.STRING, enum: ["composite", "signals", "engagement", "recency"], nullable: true },
            },
          },
        },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini timeout')), 5000)
      ),
    ]);

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const parsed = JSON.parse(text);
    return {
      filters: {
        contentTypes: parsed.filters?.contentTypes || [],
        signalTypes: parsed.filters?.signalTypes || [],
        minViews: parsed.filters?.minViews ?? undefined,
        minLikes: parsed.filters?.minLikes ?? undefined,
        dateFrom: parsed.filters?.dateFrom ?? undefined,
        dateTo: parsed.filters?.dateTo ?? undefined,
        searchTerm: parsed.filters?.searchTerm ?? undefined,
      },
      sortBy: parsed.sortBy ?? undefined,
    };
  } catch (error) {
    console.error("Post Query Parse Error:", error);
    // Fallback: treat entire input as search term
    return {
      filters: { contentTypes: [], signalTypes: [], searchTerm: input },
    };
  }
};

export const generatePostPitchText = async (items: PostDockItem[], type: 'email' | 'mediakit', context: string): Promise<string> => {
  try {
    const ai = getAI();

    const postsInfo = items.map(item => {
      const signalSummary = item.post.signals.map(s => {
        const typeLabel = s.type === 'visual' ? 'Visual' :
                          s.type === 'audio' ? 'Audio' :
                          s.type === 'caption' ? 'Caption' : 'Note';
        return `${typeLabel}: "${s.excerpt}"`;
      }).join('; ');

      return `
      - Content Type: ${item.post.contentType}
      - Caption: "${item.post.caption.slice(0, 200)}"
      - Stats: ${(item.post.stats.views / 1000).toFixed(0)}k views, ${(item.post.stats.likes / 1000).toFixed(1)}k likes, ${item.post.stats.comments} comments, ${(item.post.stats.shares / 1000).toFixed(1)}k shares
      - Signals: ${signalSummary || 'None'}
      - Score: ${item.post.compositeScore}/100
      - Note: ${item.note || 'N/A'}
      `;
    }).join('\n');

    const prompt = `
      Generate a professional ${type === 'email' ? 'outreach email to a brand' : 'mediakit summary'} pitching the following content posts from a creator.

      Context provided by user: "${context}"

      Selected Posts:
      ${postsInfo}

      ${type === 'email'
        ? 'Write a compelling email highlighting the performance and relevance of these posts. Reference specific stats and content signals.'
        : 'Create a structured summary of these posts with their metrics, content signals, and why they demonstrate strong brand alignment.'}

      Tone: Professional, persuasive, and concise.
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    return response.text || "Failed to generate pitch.";
  } catch (error) {
    console.error("Post Pitch Generation Error:", error);
    return "Error generating pitch. Please check API key.";
  }
};

export const generatePitchText = async (items: DockItem[], type: 'email' | 'mediakit', context: string): Promise<string> => {
  try {
    const ai = getAI();
    
    const creatorsInfo = items.map(item => `
      - Name: ${item.creator.name} (${item.creator.handle})
      - Stats: ${item.creator.followers} followers, ${item.creator.engagementRate}% engagement
      - Niche: ${item.creator.topics.join(', ')}
      - Why selected: ${item.note || 'Best fit for campaign'}
    `).join('\n');

    const prompt = `
      Generate a professional ${type === 'email' ? 'outreach email to a brand' : 'mediakit introduction summary'} pitching the following content creators.
      
      Context provided by user: "${context}"
      
      Creators:
      ${creatorsInfo}
      
      Tone: Professional, persuasive, and concise.
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    return response.text || "Failed to generate pitch.";
  } catch (error) {
    console.error("Pitch Generation Error:", error);
    return "Error generating pitch. Please check API key.";
  }
};