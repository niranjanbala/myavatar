import { Avatar } from '@/types';

export const DEMO_AVATARS: Avatar[] = [
  {
    id: '1',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    voice_type: 'male_confident',
    persona_tag: 'hacker',
    script: "I've just breached the firewalls of three rogue AIs — swipe right if you want in.",
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    voice_type: 'female_elegant',
    persona_tag: 'diva',
    script: "Darling, I'm too glamorous to be swiped left. Prove your taste.",
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    voice_type: 'male_friendly',
    persona_tag: 'funny',
    script: "I'm 90% caffeine and 10% bad decisions. Swipe accordingly.",
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    voice_type: 'female_professional',
    persona_tag: 'serious',
    script: "Excellence isn't a skill, it's an attitude. Are you ready to elevate?",
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    voice_type: 'male_quirky',
    persona_tag: 'quirky',
    script: "I collect vintage rubber ducks and existential thoughts. Interested?",
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    voice_type: 'female_tech',
    persona_tag: 'techy',
    script: "I debug code by day and debug my life by night. Both need work.",
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    voice_type: 'male_mysterious',
    persona_tag: 'hacker',
    script: "Zero-day exploits are my morning coffee. Care to join the dark side?",
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    voice_type: 'female_glamorous',
    persona_tag: 'diva',
    script: "I don't do ordinary, sweetie. My aura is premium subscription only.",
    created_at: new Date().toISOString(),
  },
  {
    id: '9',
    image_url: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face',
    voice_type: 'male_casual',
    persona_tag: 'funny',
    script: "My life is like a romantic comedy, except it's more comedy than romance.",
    created_at: new Date().toISOString(),
  },
  {
    id: '10',
    image_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face',
    voice_type: 'female_confident',
    persona_tag: 'serious',
    script: "I believe in meaningful connections and purposeful conversations. You?",
    created_at: new Date().toISOString(),
  },
];

// Demo vote storage for local testing
export class DemoVoteStorage {
  private static VOTES_KEY = 'demo_votes';
  private static VOTED_AVATARS_KEY = 'demo_voted_avatars';

  static getVotes(): Record<string, { up: number; down: number }> {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(this.VOTES_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  static addVote(avatarId: string, voteType: 'up' | 'down'): void {
    if (typeof window === 'undefined') return;
    
    const votes = this.getVotes();
    if (!votes[avatarId]) {
      votes[avatarId] = { up: 0, down: 0 };
    }
    votes[avatarId][voteType]++;
    localStorage.setItem(this.VOTES_KEY, JSON.stringify(votes));

    // Mark as voted
    const votedAvatars = this.getVotedAvatars();
    if (!votedAvatars.includes(avatarId)) {
      votedAvatars.push(avatarId);
      localStorage.setItem(this.VOTED_AVATARS_KEY, JSON.stringify(votedAvatars));
    }
  }

  static getVotedAvatars(): string[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.VOTED_AVATARS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static hasVoted(avatarId: string): boolean {
    return this.getVotedAvatars().includes(avatarId);
  }

  static clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.VOTES_KEY);
    localStorage.removeItem(this.VOTED_AVATARS_KEY);
  }
}