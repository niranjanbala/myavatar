// Enhanced types for user-generated content platform

export type PersonaTag = 'hacker' | 'diva' | 'funny' | 'serious' | 'quirky' | 'techy';

export type VoteType = 'up' | 'down';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'processing';

export interface User {
  id: string;
  email: string;
  username: string;
  display_name?: string;
  heygen_api_key?: string; // Encrypted
  avatar_url?: string;
  bio?: string;
  is_verified: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Avatar {
  id: string;
  creator_id?: string;
  creator?: {
    username: string;
    display_name?: string;
    is_verified: boolean;
  };
  image_url: string;
  heygen_video_url?: string;
  heygen_avatar_id?: string;
  script: string;
  persona_tag: PersonaTag;
  voice_type: string;
  is_approved: boolean;
  is_featured: boolean;
  submission_notes?: string;
  moderation_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AvatarWithVotes extends Avatar {
  vote_count: number;
  up_votes: number;
  down_votes: number;
  approval_rate: number;
}

export interface Vote {
  id: string;
  avatar_id: string;
  device_id: string;
  vote_type: VoteType;
  user_id?: string;
  created_at: string;
}

export interface AvatarSubmission {
  id: string;
  user_id: string;
  avatar_id?: string;
  status: SubmissionStatus;
  submission_data: {
    image_url?: string;
    script: string;
    persona_tag: PersonaTag;
    voice_type: string;
    submission_notes?: string;
    heygen_avatar_id?: string;
  };
  rejection_reason?: string;
  processed_at?: string;
  created_at: string;
}

export interface HeyGenUsage {
  id: string;
  user_id: string;
  avatar_id?: string;
  api_call_type: string;
  tokens_used: number;
  cost_usd: number;
  response_data: any;
  created_at: string;
}

// Form types for avatar creation
export interface AvatarCreationForm {
  script: string;
  persona_tag: PersonaTag;
  voice_type: string;
  submission_notes?: string;
  image_file?: File;
  heygen_api_key: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LeaderboardResponse {
  leaderboard: AvatarWithVotes[];
  total: number;
  page: number;
  limit: number;
}

export interface AvatarsResponse {
  avatars: Avatar[];
  total: number;
  page: number;
  limit: number;
}

// HeyGen API types
export interface HeyGenAvatarResponse {
  avatar_id: string;
  avatar_name: string;
  preview_image_url: string;
  video_url?: string;
  status: 'processing' | 'completed' | 'failed';
}

export interface HeyGenVideoRequest {
  script: string;
  voice_id: string;
  voice_type: string;
  avatar_id?: string;
  background?: string;
}

export interface HeyGenVideoResponse {
  video_id?: string;
  video_url?: string;
  thumbnail_url?: string;
  duration?: number;
  status: 'processing' | 'completed' | 'failed';
  job_id?: string;
  error?: string;
}

// User profile types
export interface UserProfile {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  is_verified: boolean;
  avatar_count: number;
  total_votes: number;
  avg_approval_rate: number;
  created_at: string;
}

// Moderation types
export interface ModerationAction {
  action: 'approve' | 'reject' | 'feature' | 'unfeature';
  reason?: string;
  notes?: string;
}

// Analytics types
export interface PlatformStats {
  total_users: number;
  total_avatars: number;
  total_votes: number;
  pending_submissions: number;
  top_creators: UserProfile[];
  trending_personas: { persona: PersonaTag; count: number }[];
}

// Voice type options
export const VOICE_TYPES = [
  'male_confident',
  'male_friendly', 
  'male_tech',
  'male_casual',
  'female_confident',
  'female_friendly',
  'female_professional',
  'female_casual',
  'neutral_ai',
  'robotic'
] as const;

export type VoiceType = typeof VOICE_TYPES[number];

// Persona descriptions for UI
export const PERSONA_DESCRIPTIONS: Record<PersonaTag, string> = {
  hacker: 'Tech-savvy, mysterious, loves coding and cybersecurity',
  diva: 'Glamorous, confident, fashion-forward and fabulous',
  funny: 'Humorous, witty, always ready with a joke or pun',
  serious: 'Professional, focused, business-minded and analytical',
  quirky: 'Unique, eccentric, creative and unconventional',
  techy: 'Innovation-focused, startup enthusiast, future-oriented'
};

// Error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string;
}