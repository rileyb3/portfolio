import { categories, projectHref, type Project } from "@/data/projects";

// ---------------------------------------------------------------------------
// The sea: layered swells, one crest peak per project.
//
// Modeled on katehuezo.com's "city" — districts floating above a skyline,
// with glowing lines drawn from a district down to the specific buildings
// that belong to it. Same interaction here; the skyline is a sea, and the
// buildings are crest peaks in the water.
//
// The interdisciplinary part is the point: peaks are deduped by slug, so a
// project that lives under two disciplines (AllTrees is Build *and* Design,
// Routesetting likewise, Pete the Snail is Play *and* Design) is ONE peak
// that two different cards both draw a line to.
//
// Why bands of swells rather than 22 individually-drawn breaking waves:
// individually curled waves at this count read as a row of lumps, not as
// water. Long overlapping swells, each lit from its own angle, actually
// read as a sea — and the per-project identity lives in the curl accent
// drawn at each peak instead of in a whole separate wave object.
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

// One color per discipline, from the site's existing palette (see
// tailwind.config.ts). Same assignments the old Disciplines tiles used, so
// the color-to-discipline association carries over.
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

// What the slide-in panel lists: that category's own entries, in its own
// order, with each entry's own title/description — so a cross-reference
// stub ("UI/UX Design — the interface behind AllTrees") still reads as
// written even though it shares a peak with the fuller AllTrees entry.
export type PanelEntry = {
  key: string;
  title: string;
  description: string;
  href: string;
};

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
// Geometry
// ---------------------------------------------------------------------------

export const SEA_VIEWBOX = { w: 2000, h: 820 };

export type Peak = {
  slug: string;
  title: string;
  disciplineIds: string[];
  x: number;
  y: number;
  band: number;
  // Which way this crest's curl breaks — mixed direction across the sea
  // reads like real surf rather than a row of identical waves.
  flip: boolean;
  size: number;
};

export type Band = {
  index: number;
  // Filled body (down to below the frame) and the crest line on top.
  body: string;
  edge: string;
  color: string;
  color2: string;
  angle: number;
  opacity: number;
  strokeWidth: number;
  peaks: Peak[];
};

// Deterministic pseudo-random: the sea must be byte-identical on server and
// client (Math.random() would hydrate-mismatch) and stable between reloads —
// this is a composition, not noise.
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Unique projects, walked round-robin across categories rather than one
// category at a time, so each discipline's peaks spread across the whole
// width. Lines from a card then fan across the scene instead of dropping
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

// Five depth bands, back (high, faint, small) to front (low, opaque, tall).
const BAND_SPEC = [
  { y: 430, amp: 78, opacity: 0.26, strokeWidth: 1.4, color: "discover", color2: "play" },
  { y: 530, amp: 96, opacity: 0.38, strokeWidth: 1.7, color: "play", color2: "write" },
  { y: 632, amp: 112, opacity: 0.52, strokeWidth: 2.1, color: "build", color2: "play" },
  { y: 726, amp: 124, opacity: 0.68, strokeWidth: 2.5, color: "write", color2: "design" },
  { y: 820, amp: 138, opacity: 0.86, strokeWidth: 3.0, color: "design", color2: "build" },
];

const LEFT = -180;
const RIGHT = SEA_VIEWBOX.w + 180;

export const bands: Band[] = (() => {
  const projects = uniqueProjects();
  const perBand = Math.ceil(projects.length / BAND_SPEC.length);

  return BAND_SPEC.map((spec, bandIndex) => {
    const mine = projects.slice(bandIndex * perBand, (bandIndex + 1) * perBand);
    const count = Math.max(mine.length, 2);

    // Peak x positions: evenly spread across the (over-wide) band, jittered.
    const peaks: Peak[] = mine.map((p, i) => {
      const t = (i + 0.5) / count;
      const jitter = (rand(bandIndex * 31.7 + i * 3.3) - 0.5) * ((RIGHT - LEFT) / count) * 0.34;
      const ampScale = 0.72 + rand(bandIndex * 13.1 + i * 7.7) * 0.5;
      return {
        slug: p.slug,
        title: p.title,
        disciplineIds: p.disciplineIds,
        x: LEFT + t * (RIGHT - LEFT) + jitter,
        y: spec.y - spec.amp * ampScale,
        band: bandIndex,
        flip: rand(bandIndex * 5.9 + i * 11.3) > 0.5,
        size: 0.85 + rand(bandIndex * 3.7 + i * 5.1) * 0.5,
      };
    });

    // The band's own outline: waterline → up to each peak → back down,
    // joined with cubics whose handles are deliberately asymmetric (short
    // on the approach, long on the back) so each swell leans, the way
    // moving water does, instead of sitting there as a symmetric hill.
    const nodes: { x: number; y: number }[] = [{ x: LEFT, y: spec.y }];
    peaks.forEach((pk, i) => {
      const next = peaks[i + 1];
      nodes.push({ x: pk.x, y: pk.y });
      const troughX = next ? (pk.x + next.x) / 2 : (pk.x + RIGHT) / 2;
      nodes.push({
        x: troughX,
        y: spec.y + rand(bandIndex * 17.3 + i * 2.9) * spec.amp * 0.12,
      });
    });
    nodes.push({ x: RIGHT, y: spec.y });

    let edge = `M ${nodes[0].x} ${nodes[0].y}`;
    for (let i = 1; i < nodes.length; i++) {
      const a = nodes[i - 1];
      const b = nodes[i];
      const rising = b.y < a.y;
      // Steep on the rise, long and lazy on the fall.
      const h1 = (b.x - a.x) * (rising ? 0.62 : 0.3);
      const h2 = (b.x - a.x) * (rising ? 0.22 : 0.55);
      edge += ` C ${a.x + h1} ${a.y} ${b.x - h2} ${b.y} ${b.x} ${b.y}`;
    }

    return {
      index: bandIndex,
      edge,
      body: `${edge} L ${RIGHT} ${SEA_VIEWBOX.h + 60} L ${LEFT} ${SEA_VIEWBOX.h + 60} Z`,
      color: DISCIPLINE_COLOR[spec.color],
      color2: DISCIPLINE_COLOR[spec.color2],
      angle: 25 + rand(bandIndex * 5.1) * 300,
      opacity: spec.opacity,
      strokeWidth: spec.strokeWidth,
      peaks,
    };
  });
})();

export const allPeaks: Peak[] = bands.flatMap((b) => b.peaks);

// The breaking lip that marks one project's crest. Only drawn when that
// project's discipline is picked — at rest the sea stays clean water, the
// way the reference site's skyline is plain until you choose a district.
// Drawing these permanently read as a row of little floating hooks.
//
// Starts down the face of the swell, rises over the peak, throws forward
// and hooks back under itself — so it sits *on* the crest line rather than
// hovering above it.
export function curlPath(p: Peak) {
  const s = 22 * p.size * (1 + p.band * 0.1);
  const dir = p.flip ? -1 : 1;
  const { x, y } = p;
  return [
    `M ${x - s * 2.1 * dir} ${y + s * 0.62}`,
    `C ${x - s * 1.1 * dir} ${y + s * 0.34} ${x - s * 0.5 * dir} ${y - s * 0.02} ${x - s * 0.05 * dir} ${y - s * 0.16}`,
    `C ${x + s * 0.5 * dir} ${y - s * 0.34} ${x + s * 1.0 * dir} ${y - s * 0.1} ${x + s * 0.86 * dir} ${y + s * 0.28}`,
    `C ${x + s * 0.74 * dir} ${y + s * 0.58} ${x + s * 0.2 * dir} ${y + s * 0.56} ${x + s * 0.18 * dir} ${y + s * 0.22}`,
  ].join(" ");
}
