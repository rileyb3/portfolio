export type Project = {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  // Mark your best 1–2 pieces per discipline as featured — those are the
  // only ones that show up on the homepage. Everything else only shows up
  // once someone clicks into that discipline's own page.
  featured?: boolean;
};

export type Category = {
  id: string;
  label: string;
  blurb: string;
  projects: Project[];
};

// Edit this file to swap in your real projects.
// `label` is the short, on-brand word shown on the button/card.
// `blurb` is the literal discipline name shown inside the section itself,
// so the site stays personal up top and clear once you're in it.
export const categories: Category[] = [
  {
    id: "build",
    label: "Build",
    blurb: "Software Engineering",
    projects: [
      {
        title: "Project Title",
        description:
          "What you built, the stack, and the outcome. Swap this out with a real project.",
        tags: ["TypeScript", "Next.js"],
        link: "#",
        featured: true,
      },
      {
        title: "App Name",
        description:
          "What the app does, the platform, and a metric or outcome if you have one.",
        tags: ["Mobile"],
        link: "#",
      },
    ],
  },
  {
    id: "design",
    label: "Design",
    blurb: "Design",
    projects: [
      {
        title: "Project Title",
        description:
          "One or two sentences on the problem, your role, and the outcome. Swap this out with a real project.",
        tags: ["Figma", "Branding"],
        link: "#",
        featured: true,
      },
      {
        title: "Second Project",
        description: "Short description of another design project.",
        tags: ["UI/UX"],
        link: "#",
      },
    ],
  },
  {
    id: "play",
    label: "Play",
    blurb: "Game Development",
    projects: [
      {
        title: "Game Title",
        description:
          "Genre, engine used, your role, and what shipped or what you'd highlight.",
        tags: ["Unity", "C#"],
        link: "#",
        featured: true,
      },
      {
        title: "Second Game",
        description: "Short description of another game project.",
        tags: ["Godot"],
        link: "#",
      },
      {
        title: "3D Animation Reel",
        description:
          "Short project videos / animation work — link a reel or a couple of clips.",
        tags: ["3D", "Animation"],
        link: "#",
      },
    ],
  },
  {
    id: "discover",
    label: "Discover",
    blurb: "Research",
    projects: [
      {
        title: "Research Project",
        description:
          "The question you investigated, your method, and the finding — link a paper or writeup if you have one.",
        tags: ["Research"],
        link: "#",
        featured: true,
      },
      {
        title: "AI Research Position",
        description:
          "Role, focus area, and what came out of it — swap in each position and its visuals.",
        tags: ["AI/ML"],
        link: "#",
      },
    ],
  },
  {
    id: "write",
    label: "Write",
    blurb: "Creative Writing",
    projects: [
      {
        title: "Publication Title",
        description:
          "Where it was published, what it's about, and a link if it's online.",
        tags: ["Fiction"],
        link: "#",
        featured: true,
      },
      {
        title: "Second Publication",
        description: "Short description of another piece of writing.",
        tags: ["Essay"],
        link: "#",
      },
    ],
  },
];

// Flattened list of every project marked `featured: true`, with its
// category attached — this is what the homepage "Selected work" grid reads
// from. Everything else only appears on that category's own page.
export const featuredProjects = categories.flatMap((c) =>
  c.projects
    .filter((p) => p.featured)
    .map((p) => ({ ...p, categoryId: c.id, categoryLabel: c.label }))
);

// Visual gallery — routesetting photos, animation stills, anything that's
// better shown than described. Drop image files in public/gallery/ and list
// them here. Captions are optional.
export type GalleryImage = {
  src: string;
  caption?: string;
};

export const gallery: GalleryImage[] = [
  { src: "/gallery/1.jpg", caption: "Routesetting — add your caption" },
  { src: "/gallery/2.jpg", caption: "Routesetting — add your caption" },
  { src: "/gallery/3.jpg", caption: "Routesetting — add your caption" },
];

export const profile = {
  name: "Riley Byers",
  tagline: "I build software, design experiences, study behavior, and tell stories.",
  intro:
    "I'm interested in the psychology behind things—the logic of characters, people, and decisions—and in using that understanding to build software that helps people. I'm drawn towards complexity, ambiguity, and intersecting disciplines. Currently, I'm inspired by multimodal sensing, rock climbing, affective computing, Susan Sontag, European starlings, and my friend Jingyi.",
  // Shown next to "Selected work" — edit to whatever range is accurate.
  workYears: "2023 – 2026",
  email: "rileyabyers@gmail.com",
  cvHref: "/cv.pdf",
  photoSrc: "/photo.jpg",
  socials: [
    { label: "GitHub", href: "https://github.com/yourusername" },
    { label: "LinkedIn", href: "https://linkedin.com/in/yourusername" },
  ],
};
