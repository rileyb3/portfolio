import { categories, projectHref, type Project } from "@/data/projects";

// ---------------------------------------------------------------------------
// The sea: Riley's own hand-drawn wave shapes, one per project.
//
// Modeled on katehuezo.com's "city" — districts floating above a skyline,
// with glowing lines drawn from a district down to the specific buildings
// that belong to it. Same interaction here; the skyline is a sea and the
// buildings are waves.
//
// The interdisciplinary part is the point: waves are deduped by project
// slug, so a project that lives under two disciplines (AllTrees is Build
// *and* Design, Routesetting likewise, Pete the Snail is Play *and*
// Design) is ONE wave that two different cards both draw a line to.
//
// The art ships as transparent PNGs (public/waves/), but they're rendered
// as CSS masks rather than plain <img>: a mask means the PNG contributes
// only its silhouette and every pixel of color comes from a gradient
// underneath it. That's what lets one flat drawing be steel-blue at rest,
// pink when Write is selected, and dimmed when it isn't — none of which a
// baked-in fill color would allow.
// ---------------------------------------------------------------------------

export type Discipline = {
  id: string;
  label: string;
  // Short "what this actually means" line under the title — the
  // CODE · ARCHITECTURE / USER WORKFLOWS row on the reference site.
  blurb: string;
  color: string;
  href: string;
};

export const DISCIPLINE_COLOR: Record<string, string> = {
  build: "#C8FF3D", // chartreuse
  design: "#FB923C", // orange
  play: "#7DD3FC", // light blue
  discover: "#C7CCD4", // pale grey
  write: "#FF8FD8", // pink
};

const DISCIPLINE_BLURB: Record<string, string> = {
  build: "code · engineering",
  design: "user · art",
  play: "video games · video art",
  discover: "research · analysis",
  write: "poetry · prose",
};

export const disciplines: Discipline[] = categories.map((c) => ({
  id: c.id,
  label: c.label,
  blurb: DISCIPLINE_BLURB[c.id] ?? c.blurb,
  color: DISCIPLINE_COLOR[c.id] ?? "#C7CCD4",
  href: `/${c.id}`,
}));

export type PanelEntry = {
  key: string;
  title: string;
  description: string;
  href: string;
};

// What the slide-in panel lists: that category's own entries, in its own
// order, with each entry's own title/description — so a cross-reference
// stub ("UI/UX Design — the interface behind AllTrees") still reads as
// written even though it shares a wave with the fuller AllTrees entry.
export const panelEntries: Record<string, PanelEntry[]> = Object.fromEntries(
  categories.map((c) => [
    c.id,
    c.projects.map((p: Project, i) => ({
      key: `${c.id}-${i}`,
      title: p.title,
      description: p.description,
      href: projectHref(p),
    })),
  ])
);

// ---------------------------------------------------------------------------
// Wave assets
// ---------------------------------------------------------------------------

// Intrinsic size of each drawing (needed for aspect-ratio, since the
// layout below only specifies width) plus `tip`: the x-fraction of the
// topmost opaque pixel, measured from the PNGs themselves. That's the
// crest of the wave, and it's where a connector line should land — the
// center of the bounding box would leave lines hanging in open water for
// the shapes whose curl sits far off to one side.
const ART: Record<string, { w: number; h: number; tip: number }> = {
  "wave-01": { w: 791, h: 400, tip: 0.657 },
  "wave-02": { w: 519, h: 349, tip: 0.621 },
  "wave-03": { w: 587, h: 230, tip: 0.647 },
  "wave-04": { w: 324, h: 173, tip: 0.627 },
  "wave-05": { w: 407, h: 195, tip: 0.657 },
  "wave-06": { w: 682, h: 173, tip: 0.529 },
  "wave-08": { w: 296, h: 214, tip: 0.297 },
  "wave-09": { w: 699, h: 125, tip: 0.471 },
  "wave-10": { w: 586, h: 353, tip: 0.424 },
  "wave-11": { w: 679, h: 83, tip: 0.486 },
  "wave-12": { w: 407, h: 195, tip: 0.657 },
  "wave-13": { w: 682, h: 166, tip: 0.529 },
  "wave-14": { w: 679, h: 83, tip: 0.486 },
  "wave-16": { w: 642, h: 118, tip: 0.484 },
  "wave-17": { w: 795, h: 121, tip: 0.162 },
  "wave-18": { w: 620, h: 250, tip: 0.623 },
  "wave-19": { w: 833, h: 612, tip: 0.664 },
  "wave-20": { w: 641, h: 415, tip: 0.828 },
  "wave-21": { w: 816, h: 503, tip: 0.858 },
  "wave-22": { w: 723, h: 155, tip: 0.485 },
  "wave-23": { w: 870, h: 255, tip: 0.426 },
};

// Hand-placed composition rather than a generated one: which shape sits
// where is a drawing decision, and the shapes vary too much (a 679×83
// ripple and an 833×612 breaker) for a formula to arrange them into
// anything that reads as one sea. Three depth rows, back to front;
// `left`/`bottom`/`width` are percentages of the sea box, and shapes are
// allowed to run off both edges so the water doesn't end at the viewport.
type Slot = {
  file: keyof typeof ART;
  left: number;
  bottom: number;
  width: number;
  depth: 0 | 1 | 2;
  flip?: boolean;
};

const LAYOUT: Slot[] = [
  // back — ripples and distant swells
  { file: "wave-11", left: -2, bottom: 40, width: 20, depth: 0 },
  { file: "wave-16", left: 19, bottom: 43, width: 17, depth: 0, flip: true },
  { file: "wave-09", left: 35, bottom: 40, width: 19, depth: 0 },
  { file: "wave-14", left: 55, bottom: 42, width: 18, depth: 0, flip: true },
  { file: "wave-17", left: 71, bottom: 41, width: 21, depth: 0 },
  { file: "wave-22", left: 87, bottom: 39, width: 19, depth: 0, flip: true },
  { file: "wave-04", left: 11, bottom: 42, width: 9, depth: 0 },
  { file: "wave-08", left: 62, bottom: 43, width: 8, depth: 0, flip: true },

  // middle — the working body of the sea
  { file: "wave-03", left: -3, bottom: 22, width: 21, depth: 1 },
  { file: "wave-06", left: 13, bottom: 20, width: 23, depth: 1, flip: true },
  { file: "wave-05", left: 29, bottom: 24, width: 15, depth: 1 },
  { file: "wave-13", left: 41, bottom: 19, width: 23, depth: 1 },
  { file: "wave-18", left: 59, bottom: 23, width: 19, depth: 1, flip: true },
  { file: "wave-23", left: 73, bottom: 18, width: 27, depth: 1 },
  { file: "wave-12", left: 91, bottom: 22, width: 15, depth: 1, flip: true },

  // front — the big breakers, hanging off the bottom edge
  { file: "wave-19", left: -5, bottom: 1, width: 27, depth: 2 },
  { file: "wave-01", left: 15, bottom: -1, width: 25, depth: 2, flip: true },
  { file: "wave-02", left: 33, bottom: 3, width: 17, depth: 2 },
  { file: "wave-21", left: 45, bottom: -3, width: 27, depth: 2 },
  { file: "wave-10", left: 65, bottom: 2, width: 20, depth: 2, flip: true },
  { file: "wave-20", left: 79, bottom: -1, width: 22, depth: 2 },
  { file: "wave-01", left: 92, bottom: 4, width: 19, depth: 2 },
];

export type Wave = {
  slug: string;
  title: string;
  disciplineIds: string[];
  src: string;
  aspect: number;
  tip: number;
  left: number;
  bottom: number;
  width: number;
  depth: 0 | 1 | 2;
  flip: boolean;
};

// Unique projects, walked round-robin across categories rather than one
// category at a time, so each discipline's waves spread across the whole
// width. Lines from a card then fan across the sea instead of dropping
// into one clump.
function uniqueProjects() {
  const bySlug = new Map<string, { title: string; disciplineIds: string[] }>();
  const order: string[] = [];
  const maxLen = Math.max(...categories.map((c) => c.projects.length));

  for (let i = 0; i < maxLen; i++) {
    for (const c of categories) {
      const p = c.projects[i];
      if (!p) continue;
      const slug = projectHref(p).replace("/projects/", "");
      const existing = bySlug.get(slug);
      if (existing) {
        if (!existing.disciplineIds.includes(c.id)) existing.disciplineIds.push(c.id);
        continue;
      }
      bySlug.set(slug, { title: p.title, disciplineIds: [c.id] });
      order.push(slug);
    }
  }
  return order.map((slug) => ({ slug, ...bySlug.get(slug)! }));
}

export const waves: Wave[] = uniqueProjects().map((p, i) => {
  const slot = LAYOUT[i % LAYOUT.length];
  const art = ART[slot.file];
  return {
    slug: p.slug,
    title: p.title,
    disciplineIds: p.disciplineIds,
    src: `/waves/${slot.file}.png`,
    aspect: art.w / art.h,
    // Mirrored shapes have their crest mirrored too.
    tip: slot.flip ? 1 - art.tip : art.tip,
    left: slot.left,
    bottom: slot.bottom,
    width: slot.width,
    depth: slot.depth,
    flip: slot.flip ?? false,
  };
});

// ---------------------------------------------------------------------------
// Color
// ---------------------------------------------------------------------------

// At rest the sea is water, not a color chart: every wave sits somewhere
// on a blue → green ramp, its own mix, darkening with distance. All the
// discipline color arrives on selection instead, which is what keeps the
// cards legible as the thing you're meant to act on.
//
// These are opaque colors rather than low-alpha accents on purpose — a
// translucent tint over a near-black page just disappears, which is
// exactly how the first pass failed.
const SEA_BLUE: [number, number, number] = [96, 178, 224];
const SEA_GREEN: [number, number, number] = [104, 205, 158];
// Brightness by depth: distant water is darker and flatter, near water is
// bright enough to carry the drawing's curl detail.
const DEPTH_LIGHT = [0.42, 0.66, 1.0];

function mix(a: [number, number, number], b: [number, number, number], t: number) {
  return a.map((v, i) => v + (b[i] - v) * t) as [number, number, number];
}

function rgb(c: [number, number, number], scale: number) {
  const [r, g, b] = c.map((v) => Math.round(Math.max(0, Math.min(255, v * scale))));
  return `rgb(${r}, ${g}, ${b})`;
}

// Deterministic per-wave values — the sea must be identical on server and
// client (a Math.random() sea would hydrate-mismatch) and stable across
// reloads, since this is a composition rather than noise.
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function waveGradient(w: Wave, i: number, angle: number, litColor: string | null) {
  if (litColor) {
    return `linear-gradient(${angle}deg, ${litColor} 0%, ${litColor}dd 58%, ${litColor}99 100%)`;
  }
  const hue = mix(SEA_BLUE, SEA_GREEN, rand(i * 2.4));
  const light = DEPTH_LIGHT[w.depth];
  // Lit face → shaded face, the two ends of the gradient. The angle varies
  // per wave (see waveAngle), so no two are lit from the same direction.
  return `linear-gradient(${angle}deg, ${rgb(hue, light)} 0%, ${rgb(hue, light * 0.62)} 55%, ${rgb(hue, light * 0.4)} 100%)`;
}

// Each wave is lit from its own direction — the detail that keeps the sea
// from reading as one flat gradient wash, and the thing Riley singled out
// about the reference site's buildings.
export function waveAngle(i: number) {
  return 20 + rand(i * 5.1) * 300;
}
