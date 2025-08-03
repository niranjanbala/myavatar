import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = 'avatar_voting_device_id';

export function getDeviceId(): string {
  if (typeof window === 'undefined') {
    // Server-side rendering - return empty string
    return '';
  }

  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  
  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  
  return deviceId;
}

export function hasVotedForAvatar(avatarId: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const votedAvatars = getVotedAvatars();
  return votedAvatars.includes(avatarId);
}

export function markAvatarAsVoted(avatarId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  const votedAvatars = getVotedAvatars();
  if (!votedAvatars.includes(avatarId)) {
    votedAvatars.push(avatarId);
    localStorage.setItem('voted_avatars', JSON.stringify(votedAvatars));
  }
}

function getVotedAvatars(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const stored = localStorage.getItem('voted_avatars');
  return stored ? JSON.parse(stored) : [];
}

export function clearVotingHistory(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem('voted_avatars');
}