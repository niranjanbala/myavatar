export interface Avatar {
  id: string;
  image_url: string;
  voice_type: string;
  persona_tag: string;
  script: string;
  heygen_video_url?: string;
  created_at: string;
}

export interface Vote {
  id: string;
  avatar_id: string;
  device_id: string;
  vote_type: 'up' | 'down';
  created_at: string;
}

export interface AvatarWithVotes extends Avatar {
  vote_count: number;
  up_votes: number;
  down_votes: number;
}

export interface SwipeDirection {
  x: number;
  y: number;
}

export interface HeyGenVideoRequest {
  script: string;
  voice_type: string;
  avatar_id?: string;
}

export interface HeyGenVideoResponse {
  video_url: string;
  status: 'processing' | 'completed' | 'failed';
  job_id: string;
}

export type PersonaTag = 'funny' | 'serious' | 'quirky' | 'techy' | 'diva' | 'hacker';

export interface ScriptPrompt {
  persona: PersonaTag;
  prompt: string;
}