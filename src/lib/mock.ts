export type Platform = "Instagram" | "Facebook" | "LinkedIn" | "Twitter";

export const platforms: Platform[] = ["Instagram", "Facebook", "LinkedIn", "Twitter"];

export const tones = [
  "Professional",
  "Casual",
  "Witty",
  "Inspirational",
  "Bold",
  "Friendly",
  "Luxury",
];

export const languages = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Arabic",
  "Japanese",
  "Portuguese",
];

export const imageStyles = [
  "Realistic",
  "Anime",
  "3D Render",
  "Cinematic",
  "Minimal",
  "Illustration",
  "Cyberpunk",
  "Watercolor",
];

export const voices = [
  "Female — Natural",
  "Male — Natural",
  "Female — Energetic",
  "Male — Deep",
  "Narrator",
];

export const reelCategories = [
  { name: "Health & Fitness", icon: "HeartPulse" },
  { name: "Fashion & Style", icon: "Shirt" },
  { name: "Education", icon: "GraduationCap" },
  { name: "Food & Nutrition", icon: "Salad" },
  { name: "Motivation", icon: "Flame" },
  { name: "Stories", icon: "BookOpen" },
  { name: "Travel", icon: "Plane" },
  { name: "Business", icon: "Briefcase" },
];

export const suggestedPrompts: Record<string, string[]> = {
  "Health & Fitness": [
    "5 healthy foods you should eat daily",
    "Beginner home workout in 30 seconds",
    "Morning routine for more energy",
  ],
  "Fashion & Style": [
    "College outfit ideas on a budget",
    "3 ways to style a white shirt",
    "Monsoon fashion essentials",
  ],
  Education: [
    "Study techniques that actually work",
    "How to remember anything faster",
    "Top 3 free learning platforms",
  ],
  "Food & Nutrition": [
    "High protein breakfast under 5 minutes",
    "Top 3 nutrition tips for glowing skin",
    "Street food you must try in Delhi",
  ],
  Motivation: [
    "How to stay motivated every day",
    "The 5 second rule that changes lives",
    "Discipline beats motivation — here's why",
  ],
  Stories: [
    "A day in the life of a student",
    "The night everything changed",
    "A short story about second chances",
  ],
  Travel: [
    "3 hidden gems in Europe",
    "Backpacking on a $20 a day budget",
    "Best sunrise spots in Bali",
  ],
  Business: [
    "3 side hustles for 2026",
    "How to pitch in 30 seconds",
    "Marketing hacks that cost nothing",
  ],
};

export const generatedPostSample = (
  platform: Platform,
  topic: string,
  tone: string,
  language: string,
) => ({
  caption: `${topic ? topic : "Your idea"} — reimagined for ${platform}. A ${tone.toLowerCase()} take, written in ${language}, built to stop the scroll in the first two seconds. ✨`,
  body: [
    `Here's the truth nobody tells you about ${topic || "this topic"}.`,
    `It's not about doing more — it's about doing the right things consistently.`,
    `Save this post and try it for the next 7 days. Then tell me what changed.`,
  ],
  emojis: ["✨", "🔥", "🚀", "💜", "📈"],
  hashtags: [
    "#contentcreator",
    "#aicontent",
    `#${platform.toLowerCase()}`,
    "#growthtips",
    "#creatorstudio",
    "#viralcontent",
    "#socialmediamarketing",
  ],
  cta: "Follow for daily creator playbooks →",
});

export type LibraryItem = {
  id: string;
  title: string;
  type: "Post" | "Image" | "Reel" | "Story" | "Product";
  platform: Platform | "All";
  liked: boolean;
  createdAt: string;
  gradient: string;
};

export const libraryItems: LibraryItem[] = [
  {
    id: "1",
    title: "Glow-up skincare carousel",
    type: "Post",
    platform: "Instagram",
    liked: true,
    createdAt: "2 hours ago",
    gradient: "from-fuchsia-500/70 to-violet-600/70",
  },
  {
    id: "2",
    title: "Neon city portrait",
    type: "Image",
    platform: "All",
    liked: true,
    createdAt: "5 hours ago",
    gradient: "from-indigo-500/70 to-sky-500/70",
  },
  {
    id: "3",
    title: "Founder story reel",
    type: "Reel",
    platform: "Instagram",
    liked: false,
    createdAt: "Yesterday",
    gradient: "from-violet-600/70 to-blue-600/70",
  },
  {
    id: "4",
    title: "SaaS launch announcement",
    type: "Post",
    platform: "LinkedIn",
    liked: true,
    createdAt: "Yesterday",
    gradient: "from-blue-600/70 to-cyan-500/70",
  },
  {
    id: "5",
    title: "Weekend sale story",
    type: "Story",
    platform: "Instagram",
    liked: false,
    createdAt: "2 days ago",
    gradient: "from-pink-500/70 to-purple-600/70",
  },
  {
    id: "6",
    title: "Coffee brand product page",
    type: "Product",
    platform: "All",
    liked: true,
    createdAt: "3 days ago",
    gradient: "from-amber-500/70 to-rose-500/70",
  },
  {
    id: "7",
    title: "Minimal desk workspace",
    type: "Image",
    platform: "All",
    liked: false,
    createdAt: "4 days ago",
    gradient: "from-slate-500/70 to-violet-500/70",
  },
  {
    id: "8",
    title: "Hiring post — design lead",
    type: "Post",
    platform: "Twitter",
    liked: false,
    createdAt: "5 days ago",
    gradient: "from-cyan-500/70 to-indigo-600/70",
  },
];

export const spotifyTracks = [
  { title: "Neon Skies", artist: "Aurora Wave", mood: "Dreamy · 92 BPM", match: 96 },
  { title: "Golden Hour", artist: "Lo-Fi Atlas", mood: "Warm · 84 BPM", match: 91 },
  { title: "Midnight Drive", artist: "Synth Harbor", mood: "Cinematic · 110 BPM", match: 88 },
  { title: "Soft Focus", artist: "Petal Club", mood: "Chill · 76 BPM", match: 84 },
  { title: "Runway", artist: "Kite & Co.", mood: "Confident · 122 BPM", match: 80 },
];

export const analyticsSeries = [
  { month: "Feb", posts: 34, downloads: 21, favorites: 12 },
  { month: "Mar", posts: 48, downloads: 31, favorites: 19 },
  { month: "Apr", posts: 61, downloads: 44, favorites: 26 },
  { month: "May", posts: 55, downloads: 39, favorites: 24 },
  { month: "Jun", posts: 78, downloads: 58, favorites: 37 },
  { month: "Jul", posts: 96, downloads: 71, favorites: 45 },
  { month: "Aug", posts: 124, downloads: 92, favorites: 61 },
];

export const engagementByPlatform = [
  { platform: "Instagram", score: 92 },
  { platform: "LinkedIn", score: 78 },
  { platform: "Twitter", score: 64 },
  { platform: "Facebook", score: 57 },
];

export const storyTemplates = [
  { name: "Bold Quote", accent: "from-violet-600 to-fuchsia-500" },
  { name: "Product Drop", accent: "from-blue-600 to-cyan-400" },
  { name: "Poll & Ask", accent: "from-pink-500 to-orange-400" },
  { name: "Behind the Scenes", accent: "from-emerald-500 to-teal-400" },
  { name: "Countdown", accent: "from-indigo-600 to-purple-500" },
  { name: "Testimonial", accent: "from-rose-500 to-violet-600" },
];
