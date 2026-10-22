export type SiteSettings = {
  name: string;
  shortName: string;
  fullName: string;
  foundation: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  hours: string;
  logo: string;
  domain: string;
};

export type PageHero = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

export type HomePillar = {
  title: string;
  desc: string;
};

export type HomeContent = {
  heroTitle: string;
  heroEmphasis: string;
  heroLead: string;
  heroImage: string;
  foundationEyebrow: string;
  foundationTitle: string;
  foundationLead: string;
  pillars: HomePillar[];
  quoteText: string;
  quoteCite: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutLead: string;
  aboutBullets: string[];
  ctaQuote: string;
  ctaButton: string;
};

export type TentangValue = {
  label: string;
  title: string;
  desc: string;
};

export type TentangContent = {
  hero: PageHero;
  whoEyebrow: string;
  whoTitle: string;
  whoLead: string;
  whoFoundationNote: string;
  visionTitle: string;
  visionText: string;
  missionTitle: string;
  missionItems: string[];
  valuesEyebrow: string;
  valuesTitle: string;
  values: TentangValue[];
};

export type ProgramItem = {
  id: number;
  title: string;
  description: string;
  image: string;
  sortOrder: number;
};

export type FacilityItem = {
  id: number;
  title: string;
  description: string;
  image: string;
  sortOrder: number;
};

export type NewsItem = {
  id: number;
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  excerpt: string;
  body: string;
  coverImage: string;
  videoKind: 'none' | 'youtube' | 'upload';
  videoUrl: string;
  videoPath: string;
  published: boolean;
};

export type MediaItem = {
  id: number;
  filename: string;
  path: string;
  mimeType: string;
  size: number;
  alt: string;
  createdAt: string;
};
