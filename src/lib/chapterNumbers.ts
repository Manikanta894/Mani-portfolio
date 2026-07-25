/**
 * Canonical chapter numbers — must always match the order in PremiumNav's
 * FALLBACK_ITEMS / the site's navigation. Chapter headers should read from
 * here instead of storing their own "number" in Supabase content, since a
 * content-editable number can silently drift from the nav (e.g. Contact
 * showing "/12" while the nav says "10 Contact").
 */
export const CHAPTER_NUMBERS: Record<string, string> = {
  cover: "00",
  about: "01",
  education: "02",
  experience: "03",
  work: "04",
  ecosystem: "05",
  research: "06",
  credentials: "07",
  philosophy: "08",
  linkedin: "09",
  contact: "10",
  "beyond-me": "11",
};
