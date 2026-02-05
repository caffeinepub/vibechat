export interface SponsoredVideoItem {
  id: string;
  title: string;
  description: string;
  thumbnailPath: string;
  duration: number; // in seconds
}

export const mockSponsoredItems: SponsoredVideoItem[] = [
  {
    id: 'sponsored-1',
    title: 'Discover Amazing Travel Destinations',
    description: 'Explore breathtaking locations around the world with our curated travel guide.',
    thumbnailPath: '/assets/generated/vibechat-sponsored-1.dim_720x1280.png',
    duration: 15,
  },
  {
    id: 'sponsored-2',
    title: 'Latest Tech Innovations',
    description: 'Stay ahead with cutting-edge technology and innovative solutions for modern life.',
    thumbnailPath: '/assets/generated/vibechat-sponsored-2.dim_720x1280.png',
    duration: 12,
  },
  {
    id: 'sponsored-3',
    title: 'Healthy Living Tips',
    description: 'Transform your lifestyle with expert wellness advice and fitness inspiration.',
    thumbnailPath: '/assets/generated/vibechat-sponsored-3.dim_720x1280.png',
    duration: 10,
  },
];
