export type MembershipType = '0' | '1' | '2';

export type Mode = 'T2V' | 'I2V';

export type AspectRatio = '16:9' | '4:3' | '1:1' | '3:4' | '9:16';

export type Duration = '5s' | '10s' | '15s';

export interface User {
  id: number;
  username: string;
  email: string;
  premium: MembershipType;
  tokens: number;
  admin: number;
  created_at: string;
  updated_at: string;
}

export interface GenSettings {
  mode: Mode;
  prompt: string;
  negativePrompt: string;
  aspectRatio: AspectRatio;
  duration: Duration;
}

export interface VideoData {
  id: number;
  url: string;
  prompt: string;
  timestamp: string;
  thumbnail: string | null;
}

export interface GenEstimate {
  tokens: number;
  duration: number;
}
