import type {
  AchievementItem,
  ActivityItem,
  FacilityItem,
  HomeContent,
  NewsItem,
  PartnerItem,
  PersonItem,
  PpdbContent,
  ProgramItem,
  ScheduleItem,
  SiteSettings,
  TestimonialItem,
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
  instagram: site.instagram,
  youtube: site.youtube,
  facebook: site.facebook,
  mapsUrl: site.mapsUrl,
};

export const defaultPpdbContent: PpdbContent = {
  open: true,
  academicYear: '2027/2028',
  headline: 'Penerimaan Santri Baru',
  tagline: "Al Qur'annya Oke! Akademiknya Oke!",
  registrationFeeLabel: 'Biaya Pendaftaran',
  registrationFee: 'Rp 250.000',
  entranceFeeLabel: 'Uang Masuk',
  entranceFee: 'Rp 7,5 Juta',
  sppFeeLabel: 'SPP Bulanan',
  sppFee: 'Rp 1,45 Juta',
  sppNote: 'Pendidikan, makan, laundry',
  waMessage:
    "Assalamu'alaikum, saya ingin informasi pendaftaran santri baru TA 2027/2028 di SMP Cendekia Boarding School. Mohon bantuannya.",
  ctaLabel: 'Daftar Sekarang',
};

export const defaultSchedule: ScheduleItem[] = [
  { id: 1, time: '04.00', activity: 'Bangun tidur & shalat tahajud', published: true, sortOrder: 1 },
  { id: 2, time: '04.30', activity: 'Shalat Subuh berjamaah', published: true, sortOrder: 2 },
  { id: 3, time: '05.00', activity: 'Halaqoh Al-Qur’an', published: true, sortOrder: 3 },
  { id: 4, time: '06.00', activity: 'Persiapan sekolah & sarapan', published: true, sortOrder: 4 },
  { id: 5, time: '07.30–12.00', activity: 'Kegiatan belajar sekolah', published: true, sortOrder: 5 },
  { id: 6, time: '12.00', activity: 'Shalat Dzuhur & makan siang', published: true, sortOrder: 6 },
  { id: 7, time: '13.00', activity: 'Istirahat siang', published: true, sortOrder: 7 },
  { id: 8, time: '15.00', activity: 'Shalat Ashar berjamaah', published: true, sortOrder: 8 },
  { id: 9, time: '15.30', activity: 'Talaqqi / kegiatan sore', published: true, sortOrder: 9 },
  { id: 10, time: '17.30', activity: 'Shalat Maghrib & Halaqoh Al-Qur’an', published: true, sortOrder: 10 },
  { id: 11, time: '19.00', activity: 'Shalat Isya berjamaah', published: true, sortOrder: 11 },
  { id: 12, time: '19.30', activity: 'Belajar malam / murojaah', published: true, sortOrder: 12 },
  { id: 13, time: '21.30', activity: 'Persiapan tidur', published: true, sortOrder: 13 },
  { id: 14, time: '22.00', activity: 'Istirahat malam', published: true, sortOrder: 14 },
];

export const defaultTestimonials: TestimonialItem[] = [
  {
    id: 1,
    name: 'Ibu Maryati',
    role: 'Wali santri kelas 8',
    quote:
      'Alhamdulillah, di pondok, putri saya menjadi lebih mandiri, rajin sholat dan mengaji tanpa diingatkan.',
    photo: '',
    published: true,
    sortOrder: 1,
  },
  {
    id: 2,
    name: 'Ibu Dian Yuli Widiani',
    role: 'Wali santri kelas 9',
    quote:
      'Ustadz dan ustadzah di CBS sangat ramah, sopan, dan terbuka kepada kami. Terima kasih sudah mendidik anak kami dengan baik.',
    photo: '',
    published: true,
    sortOrder: 2,
  },
  {
    id: 3,
    name: 'Bp. Dr. H. Rio Erismen Armen, Lc., M.A.',
    role: 'Wali santri kelas 8 dan 9',
    quote:
      'Putra putri kita dibekali dengan kemampuan membaca dan menghafal Al-Quran, serta dididik untuk mempunyai kemampuan akademik yang kompetitif.',
    photo: '',
    published: true,
    sortOrder: 3,
  },
];

export const defaultAchievements: AchievementItem[] = [
  { id: 1, title: 'Juara MHQ tingkat nasional', kind: 'external', year: '2025', published: true, sortOrder: 1 },
  { id: 2, title: 'Prestasi baca puisi & literasi', kind: 'external', year: '2025', published: true, sortOrder: 2 },
  { id: 3, title: 'Prestasi pencak silat / Tapak Suci', kind: 'external', year: '2024', published: true, sortOrder: 3 },
  { id: 4, title: 'Olimpiade Matematika & Bahasa Inggris', kind: 'external', year: '2024', published: true, sortOrder: 4 },
  { id: 5, title: 'Santri menghafal hingga 26 juz', kind: 'internal', year: '2025', published: true, sortOrder: 5 },
  { id: 6, title: 'Hafalan Aqidatul Awwam', kind: 'internal', year: '2025', published: true, sortOrder: 6 },
  { id: 7, title: 'Penerbitan karya / buku santri', kind: 'internal', year: '2024', published: true, sortOrder: 7 },
];

export const defaultActivities: ActivityItem[] = [
  { id: 1, title: 'Yaumun ma’al Qur’an', description: 'Hari Qur’an mingguan untuk memperkuat tilawah dan murojaah.', published: true, sortOrder: 1 },
  { id: 2, title: 'Halaqah & Tasmi’', description: 'Setoran dan simakan hafalan secara terjadwal.', published: true, sortOrder: 2 },
  { id: 3, title: 'Literacy Day', description: 'Pembiasaan baca dan tulis untuk daya nalar santri.', published: true, sortOrder: 3 },
  { id: 4, title: 'Bahasa Arab & Inggris', description: 'Latihan komunikasi aktif dalam kehidupan asrama.', published: true, sortOrder: 4 },
  { id: 5, title: 'Character Building Session', description: 'Sesi pembentukan karakter dan kepemimpinan.', published: true, sortOrder: 5 },
  { id: 6, title: 'Social Day & Outing Class', description: 'Kegiatan sosial dan pembelajaran di luar kelas.', published: true, sortOrder: 6 },
  { id: 7, title: 'Pramuka & Tapak Suci', description: 'Ekstrakurikuler kedisiplinan, bela diri, dan kerja sama.', published: true, sortOrder: 7 },
  { id: 8, title: 'Panahan & Fun Cooking', description: 'Pengembangan minat dan keterampilan hidup.', published: true, sortOrder: 8 },
  { id: 9, title: 'Public Speaking', description: 'Latihan menyampaikan gagasan dengan percaya diri dan beradab.', published: true, sortOrder: 9 },
];

export const defaultPartners: PartnerItem[] = [
  { id: 1, name: 'Nurul Fikri', logo: '', url: '', published: true, sortOrder: 1 },
  { id: 2, name: 'Catalyst', logo: '', url: '', published: true, sortOrder: 2 },
];

export const defaultPeople: PersonItem[] = [
  { id: 1, name: 'Pimpinan Pesantren', role: 'Pembina', photo: '', published: true, sortOrder: 1 },
  { id: 2, name: 'Kepala Sekolah', role: 'SMP Cendekia Boarding School', photo: '', published: true, sortOrder: 2 },
];

export const defaultHomeContent: HomeContent = {
  heroTitle: 'Mendidik Generasi',
  heroEmphasis: 'Berilmu',
  heroLead:
    'Pesantren Modern Terpadu — memadukan tahfidz, keilmuan, serta pembinaan adab dalam lingkungan boarding yang terarah.',
  heroImage: '',
  foundationEyebrow: 'Cerita Pesantren',
  foundationTitle: 'Generasi Emas Nusantara Islami',
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
  whoTitle: 'Pesantren Modern Terpadu Cendekia',
  whoLead:
    'Kami adalah rumah belajar bagi generasi muslim yang ingin tumbuh dalam ilmu, iman, dan akhlak. Pendekatan boarding membuat pembinaan berlangsung utuh — di kelas maupun dalam kehidupan sehari-hari.',
  whoFoundationNote: `${site.foundation} mengelola ${site.fullName}.`,
  visionTitle: 'Visi',
  visionText:
    'Terdidiknya Generasi Emas Nusantara Islami Untuk Semesta (GENIUS) dengan karakter ahli ibadah, berilmu, produktif, peduli dan berjiwa pemimpin.',
  missionTitle: 'Misi',
  missionItems: [
    'Menumbuhkan ketakwaan dan keshalihan dalam ibadah',
    'Mengembangkan kecerdasan dan keilmuan santri',
    'Membiasakan gaya hidup sehat, kreatif, dan terampil',
    'Membangun kecerdasan sosial, etika, dan kerja sama',
    'Menumbuhkan kepemimpinan, tanggung jawab, dan inisiatif',
  ],
  valuesEyebrow: 'Panca Karakter Santri',
  valuesTitle: 'Sholih · Cerdas · Produktif · Peduli · Pelopor Kebaikan',
  values: [
    { label: '01', title: 'Sholih', desc: 'Ahli ibadah dengan adab yang lurus.' },
    { label: '02', title: 'Cerdas', desc: 'Berilmu, bernalar, dan siap belajar sepanjang hayat.' },
    { label: '03', title: 'Produktif', desc: 'Berkarya dan bermanfaat bagi lingkungan.' },
    { label: '04', title: 'Peduli', desc: 'Peka terhadap sesama dan lingkungan sosial.' },
    { label: '05', title: 'Pelopor Kebaikan', desc: 'Berani memulai kebaikan dan menjadi teladan.' },
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
    body: `<p>${p.desc}</p>`,
    image: '',
    videoKind: 'none' as const,
    videoUrl: '',
    videoPath: '',
    published: true,
    sortOrder: i,
    slug: '',
  }));
}

export function defaultFacilities(): Omit<FacilityItem, 'id'>[] {
  return facilities.map((f, i) => ({
    title: f.title,
    description: f.desc,
    body: `<p>${f.desc}</p>`,
    image: '',
    videoKind: 'none' as const,
    videoUrl: '',
    videoPath: '',
    published: true,
    sortOrder: i,
    slug: '',
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
