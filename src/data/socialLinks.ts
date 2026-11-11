/**
 * Official Social Media Channels for Wonder World Kids Learning
 */

export interface SocialLink {
  id: 'youtube' | 'instagram' | 'facebook';
  label: string;
  handle: string;
  url: string;
  description: string;
  badge: string;
  brandColor: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'youtube',
    label: 'YouTube',
    handle: '@wonderworldkidslearning',
    url: 'https://youtube.com/@wonderworldkidslearning?si=ty3R8YlOe2tp0HgB',
    description: 'Fun educational videos, gameplay previews, and learning songs for kids.',
    badge: 'Watch on YouTube',
    brandColor: '#FF0000'
  },
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@wonder_world_kids_learning',
    url: 'https://www.instagram.com/wonder_world_kids_learning?vrfl=Zmh4d24xMGw1cDg1',
    description: 'Daily learning tips, creative ideas, reels, and behind-the-scenes updates.',
    badge: 'Follow on Instagram',
    brandColor: '#E1306C'
  },
  {
    id: 'facebook',
    label: 'Facebook',
    handle: 'Wonder World Kids Learning',
    url: 'https://www.facebook.com/share/19g4zk4K1G/',
    description: 'Connect with our parent community, family discussions, and product news.',
    badge: 'Join on Facebook',
    brandColor: '#1877F2'
  }
];

export const SUPPORT_EMAIL = 'wonderworldkidslearning@gmail.com';

