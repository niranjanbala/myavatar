import { HeyGenVideoRequest, HeyGenVideoResponse, PersonaTag, ScriptPrompt } from '@/types';

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const HEYGEN_API_URL = process.env.HEYGEN_API_URL || 'https://api.heygen.com/v2';

// Sample script prompts for different personas
export const SCRIPT_PROMPTS: Record<PersonaTag, string[]> = {
  hacker: [
    "I've just breached the firewalls of three rogue AIs — swipe right if you want in.",
    "Zero-day exploits are my morning coffee. Care to join the dark side?",
    "I speak fluent binary and broken English. 01001000 01101001 there!"
  ],
  diva: [
    "Darling, I'm too glamorous to be swiped left. Prove your taste.",
    "I don't do ordinary, sweetie. My aura is premium subscription only.",
    "Honey, I'm not high maintenance, I'm just worth it. Swipe accordingly."
  ],
  funny: [
    "I'm 90% caffeine and 10% bad decisions. Swipe accordingly.",
    "My life is like a romantic comedy, except it's more comedy than romance.",
    "I put the 'fun' in dysfunctional. Ready for this adventure?"
  ],
  serious: [
    "Excellence isn't a skill, it's an attitude. Are you ready to elevate?",
    "I believe in meaningful connections and purposeful conversations. You?",
    "Quality over quantity, always. Let's make this interaction count."
  ],
  quirky: [
    "I collect vintage rubber ducks and existential thoughts. Interested?",
    "My superpower is making awkward situations even more awkward. Cool, right?",
    "I name my plants and they judge my life choices. We're all friends here."
  ],
  techy: [
    "I debug code by day and debug my life by night. Both need work.",
    "My relationship status: It's complicated with JavaScript. You understand?",
    "I speak Python, Java, and sarcasm fluently. Pick your favorite."
  ]
};

export function generateScript(persona: PersonaTag): string {
  const prompts = SCRIPT_PROMPTS[persona];
  return prompts[Math.floor(Math.random() * prompts.length)];
}

export async function generateScriptWithAI(persona: PersonaTag): Promise<string> {
  try {
    const response = await fetch('/api/generate-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ persona }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate script with AI');
    }

    const data = await response.json();
    return data.script;
  } catch (error) {
    console.error('Error generating script with AI:', error);
    // Fallback to predefined scripts
    return generateScript(persona);
  }
}

export async function createHeyGenVideo(request: HeyGenVideoRequest): Promise<HeyGenVideoResponse> {
  if (!HEYGEN_API_KEY) {
    throw new Error('HeyGen API key not configured');
  }

  try {
    const response = await fetch(`${HEYGEN_API_URL}/video/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HEYGEN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script: request.script,
        voice: {
          type: request.voice_type,
        },
        avatar: request.avatar_id || 'default',
        quality: 'high',
      }),
    });

    if (!response.ok) {
      throw new Error(`HeyGen API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      video_url: data.video_url || '',
      status: data.status || 'processing',
      job_id: data.job_id || '',
    };
  } catch (error) {
    console.error('Error creating HeyGen video:', error);
    throw error;
  }
}

export async function getHeyGenVideoStatus(jobId: string): Promise<HeyGenVideoResponse> {
  if (!HEYGEN_API_KEY) {
    throw new Error('HeyGen API key not configured');
  }

  try {
    const response = await fetch(`${HEYGEN_API_URL}/video/status/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${HEYGEN_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HeyGen API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      video_url: data.video_url || '',
      status: data.status || 'processing',
      job_id: jobId,
    };
  } catch (error) {
    console.error('Error getting HeyGen video status:', error);
    throw error;
  }
}