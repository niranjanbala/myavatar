import { NextRequest, NextResponse } from 'next/server';
import { PersonaTag } from '@/types';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const PERSONA_PROMPTS: Record<PersonaTag, string> = {
  hacker: "Generate a short, witty script (max 60 words) for a hacker character. Make it edgy, tech-savvy, and slightly mysterious. Include references to coding, cybersecurity, or digital rebellion.",
  diva: "Generate a short, glamorous script (max 60 words) for a diva character. Make it confident, fabulous, and slightly dramatic. Include references to luxury, style, or being fabulous.",
  funny: "Generate a short, humorous script (max 60 words) for a funny character. Make it witty, self-deprecating, and relatable. Include everyday situations or quirky observations.",
  serious: "Generate a short, professional script (max 60 words) for a serious character. Make it thoughtful, inspiring, and meaningful. Focus on growth, success, or deep connections.",
  quirky: "Generate a short, eccentric script (max 60 words) for a quirky character. Make it weird, endearing, and unique. Include unusual hobbies, strange thoughts, or odd observations.",
  techy: "Generate a short, nerdy script (max 60 words) for a tech enthusiast. Make it geeky, relatable to developers, and include programming references or tech humor."
};

export async function POST(request: NextRequest) {
  try {
    const { persona } = await request.json();

    if (!persona || !PERSONA_PROMPTS[persona as PersonaTag]) {
      return NextResponse.json(
        { error: 'Invalid persona provided' },
        { status: 400 }
      );
    }

    // If OpenAI API key is not available, use fallback
    if (!OPENAI_API_KEY) {
      const fallbackScripts: Record<PersonaTag, string[]> = {
        hacker: [
          "I've just breached the firewalls of three rogue AIs — swipe right if you want in.",
          "Zero-day exploits are my morning coffee. Care to join the dark side?"
        ],
        diva: [
          "Darling, I'm too glamorous to be swiped left. Prove your taste.",
          "I don't do ordinary, sweetie. My aura is premium subscription only."
        ],
        funny: [
          "I'm 90% caffeine and 10% bad decisions. Swipe accordingly.",
          "My life is like a romantic comedy, except it's more comedy than romance."
        ],
        serious: [
          "Excellence isn't a skill, it's an attitude. Are you ready to elevate?",
          "I believe in meaningful connections and purposeful conversations. You?"
        ],
        quirky: [
          "I collect vintage rubber ducks and existential thoughts. Interested?",
          "My superpower is making awkward situations even more awkward. Cool, right?"
        ],
        techy: [
          "I debug code by day and debug my life by night. Both need work.",
          "My relationship status: It's complicated with JavaScript. You understand?"
        ]
      };

      const scripts = fallbackScripts[persona as PersonaTag];
      const script = scripts[Math.floor(Math.random() * scripts.length)];
      
      return NextResponse.json({ script });
    }

    // Use OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a creative writer specializing in short, engaging character scripts for a swipe-based voting app. Keep scripts under 60 words and make them compelling for users to vote on.'
          },
          {
            role: 'user',
            content: PERSONA_PROMPTS[persona as PersonaTag]
          }
        ],
        max_tokens: 100,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const script = data.choices[0]?.message?.content?.trim() || '';

    return NextResponse.json({ script });
  } catch (error) {
    console.error('Error generating script:', error);
    return NextResponse.json(
      { error: 'Failed to generate script' },
      { status: 500 }
    );
  }
}