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
  instagram: string;
  youtube: string;
  facebook: string;
  mapsUrl: string;
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

export type PpdbContent = {
  open: boolean;
  academicYear: string;
  headline: string;
  tagline: string;
  registrationFeeLabel: string;
  registrationFee: string;
  entranceFeeLabel: string;
  entranceFee: string;
  sppFeeLabel: string;
  sppFee: string;
  sppNote: string;
  waMessage: string;
  ctaLabel: string;
};

export type ScheduleItem = {
  id: number;
  time: string;
  activity: string;
  published: boolean;
  sortOrder: number;
};

export type TestimonialItem = {
  id: number;
  name: string;
  role: string;
  quote: string;
  photo: string;
  published: boolean;
  sortOrder: number;
};

export type AchievementItem = {
  id: number;
  title: string;
  kind: 'external' | 'internal';
  year: string;
  published: boolean;
  sortOrder: number;
};

export type ActivityItem = {
  id: number;
  title: string;
  description: string;
  published: boolean;
  sortOrder: number;
};

export type PartnerItem = {
  id: number;
  name: string;
  logo: string;
  url: string;
  published: boolean;
  sortOrder: number;
};

export type PersonItem = {
  id: number;
  name: string;
  role: string;
  photo: string;
  published: boolean;
  sortOrder: number;
};

export type VideoKind = 'none' | 'youtube' | 'upload';

export type ProgramItem = {
  id: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  image: string;
  videoKind: VideoKind;
  videoUrl: string;
  videoPath: string;
  published: boolean;
  sortOrder: number;
};

export type FacilityItem = {
  id: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  image: string;
  videoKind: VideoKind;
  videoUrl: string;
  videoPath: string;
  published: boolean;
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
  videoKind: VideoKind;
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
