import type {
  FacilityItem,
  HomeContent,
  NewsItem,
  ProgramItem,
  SiteSettings,
  TentangContent,
  PageHero,
} from './types';
import { facilities, news, programs, site } from '../data/site';

export const defaultSiteSettings: SiteSettings = {
  name: site.name,
  shortName: site.shortName,
  fullName: site.fullName,
  foundation: site.foundation,
  tagline: site.tagline,
  email: site.email,
  phone: site.phone,
  address: site.address,
  hours: site.hours,
  logo: site.logo,
  domain: site.domain,
};

export const defaultHomeContent: HomeContent = {
  heroTitle: 'Mendidik Generasi',
  heroEmphasis: 'Berilmu',
  heroLead:
    'Pesantren Modern Terpadu — memadukan tahfidz, keilmuan, serta pembinaan adab dalam lingkungan boarding yang terarah.',
  heroImage: '',
  foundationEyebrow: 'Fondasi Kami',
  foundationTitle: 'Pendidikan yang Seimbang & Bermakna',
  foundationLead:
    'Ilmu, iman, dan akhlak tumbuh bersama dalam ritme kehidupan pesantren yang tenang dan disiplin.',
  pillars: [
    { title: 'Pendidikan Qur’ani', desc: 'Pembinaan tahfidz dan pemahaman Al-Qur’an yang terstruktur.' },
    { title: 'Akademik Unggul', desc: 'Kurikulum kuat agar santri siap ke jenjang pendidikan tinggi.' },
    { title: 'Adab & Karakter', desc: 'Pembiasaan ibadah, adab, dan kepemimpinan dalam asrama.' },
  ],
  quoteText: '“Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia.”',
  quoteCite: '— Hadis Nabi Muhammad ﷺ',
  aboutEyebrow: 'Tentang Kami',
  aboutTitle: site.name,
  aboutLead:
    'Lembaga pendidikan Islam berasrama yang membentuk pribadi muslim cerdas, beriman, dan berakhlak mulia — memadukan tradisi pesantren dengan standar pendidikan modern.',
  aboutBullets: [
    'Integrasi kurikulum diniyah dan akademik',
    'Pembinaan bahasa Arab & Inggris',
    'Penguatan karakter dan soft skill',
    'Lingkungan belajar aman, nyaman, dan religius',
  ],
  ctaQuote: 'Siap menjadi bagian dari keluarga besar Pesantren Cendekia?',
  ctaButton: 'Hubungi Panitia Pendaftaran',
};

export const defaultTentangContent: TentangContent = {
  hero: {
    eyebrow: 'Profil Lembaga',
    title: 'Tentang Kami',
    subtitle: `Mengenal lebih dekat semangat, arah, dan nilai yang menjiwai ${site.name}.`,
  },
  whoEyebrow: 'Siapa Kami',
  whoTitle: 'Memadukan Tradisi Pesantren & Pendidikan Modern',
  whoLead:
    'Kami adalah rumah belajar bagi generasi muslim yang ingin tumbuh dalam ilmu, iman, dan akhlak. Pendekatan boarding membuat pembinaan berlangsung utuh — di kelas maupun dalam kehidupan sehari-hari.',
  whoFoundationNote: `${site.foundation} mengelola ${site.fullName}.`,
  visionTitle: 'Visi',
  visionText:
    'Menjadi pesantren unggulan yang mencetak generasi muslim berilmu, berakhlak karimah, dan berdaya saing global.',
  missionTitle: 'Misi',
  missionItems: [
    'Menyelenggarakan pendidikan Islam yang utuh dan relevan',
    'Membangun budaya Qur’ani dalam kehidupan santri',
    'Mengembangkan potensi akademik dan non-akademik',
    'Menumbuhkan kemandirian, kepemimpinan, dan kepedulian sosial',
  ],
  valuesEyebrow: 'Nilai Inti',
  valuesTitle: 'Iman · Ilmu · Akhlak',
  values: [
    { label: 'I', title: 'Iman', desc: 'Setiap aktivitas diarahkan untuk memperkokoh keimanan dan ketakwaan.' },
    { label: 'II', title: 'Ilmu', desc: 'Belajar menjadi budaya, bukan sekadar kewajiban formal.' },
    { label: 'III', title: 'Akhlak', desc: 'Adab menjadi mahkota ilmu dalam interaksi santri, guru, dan masyarakat.' },
  ],
};

export const defaultPageHero: Record<string, PageHero> = {
  program: {
    eyebrow: 'Kurikulum & Kegiatan',
    title: 'Program Pendidikan',
    subtitle: 'Rangkaian program yang membentuk santri secara utuh — spiritual, intelektual, dan karakter.',
  },
  fasilitas: {
    eyebrow: 'Lingkungan Belajar',
    title: 'Fasilitas Pesantren',
    subtitle: 'Sarana yang mendukung ibadah, belajar, istirahat, dan pengembangan potensi santri.',
  },
  berita: {
    eyebrow: 'Informasi Terkini',
    title: 'Berita & Kegiatan',
    subtitle: 'Update kegiatan pendidikan, keagamaan, dan prestasi santri.',
  },
  kontak: {
    eyebrow: 'Hubungi Kami',
    title: 'Kontak & Pendaftaran',
    subtitle: 'Silakan hubungi panitia untuk informasi program, kunjungan, dan pendaftaran.',
  },
};

export function defaultPrograms(): Omit<ProgramItem, 'id'>[] {
  return programs.map((p, i) => ({
    title: p.title,
    description: p.desc,
    image: '',
    sortOrder: i,
  }));
}

export function defaultFacilities(): Omit<FacilityItem, 'id'>[] {
  return facilities.map((f, i) => ({
    title: f.title,
    description: f.desc,
    image: '',
    sortOrder: i,
  }));
}

export function defaultNews(): Omit<NewsItem, 'id'>[] {
  return news.map((n) => ({
    slug: n.slug,
    title: n.title,
    category: n.category,
    publishedAt: n.date,
    excerpt: n.excerpt,
    body: `<p>${n.excerpt}</p>`,
    coverImage: '',
    videoKind: 'none' as const,
    videoUrl: '',
    videoPath: '',
    published: true,
  }));
}
