# Portfolio site — Architecture

A short map of how this site fits together. Next.js 14 (App Router) +
TypeScript + Tailwind CSS, deployed on Vercel from the `master` branch of
`github.com/rileyb3/portfolio`.

## 1. The core idea: one data file drives everything

Almost all content lives in **`src/data/projects.ts`**. Pages and components
don't contain copy; they render whatever that file says.

```
src/data/projects.ts  ──►  home page sections (by category)
                      ──►  project cards / featured cards
                      ──►  one page per project at /projects/<slug>
```

The site is **fully static**: at build time Next.js generates a plain HTML page
for every project (38 pages total), so there is no server, database, or API at
runtime and nothing to attack beyond the static files.

## 2. The data model

`projects.ts` exports `categories` (Build, Design, Play, Discover, Write). Each
category holds a list of `Project` entries.

A `Project` has:

- **Card fields:** `title`, `slug`, `summary`, `image`, optional `cardImage`
  (a cover made just for cards), `featured`, `link`/`linkLabel`.
- **Page header:** `meta` (Timeline / Role / Tools groups shown as pills),
  `heroImageFirst`, `heroLayout: "split"`.
- **`waveGroup`:** entries sharing a string (e.g. `"alltrees"`) are treated as
  the same work by the animated sea on the home page.
- **`body`:** an ordered list of **blocks**. The page renders them top to
  bottom. This is how each case study is composed.

### Block types

| Block | What it renders |
|---|---|
| `text`, `heading` | Paragraphs and section headings in the reading column |
| `images`, `text-with-image` | Image groups / text beside an image |
| `full-image`, `image-row`, `gallery` | Full-bleed imagery: single, side-by-side row, masonry index |
| `beat` | A "story beat": kicker + heading + text (+ image), full width |
| `before-after`, `problem-solution` | Comparison layouts; `problem-solution` supports a scroll-in-frame for tall screenshots (`scrollHeight`) |
| `cards` | Numbered card band (`NumberedCards`); `leadWith: "subtitle"` flips the hierarchy so the subtitle is the bold label |
| `timeline` | Project timeline chart |
| `move-comparison` | Four autoplay looping videos with hover-to-isolate and a precision meter (Route Design) |
| `route-trace` | Animated line drawn over a route photo |
| `slideshow`, `image-pile`, `video`, `palette`, `pills` | Media and small display blocks |

Adding a new block type means three edits: the type in `projects.ts`, a
component in `src/components/`, and a branch in the renderer in
`src/app/projects/[slug]/page.tsx`.

## 3. Folder map

```
src/
  app/
    layout.tsx             Fonts (Manrope, Space Grotesk), site metadata, header
    page.tsx               Home page
    about/, experience/    Static pages
    projects/[slug]/page.tsx   THE project page: header, meta row, block renderer
  components/              One file per visual piece (see below)
  components/sea/          Animated sea scene on the home page
  data/projects.ts         All content
public/projects/<project>/ Images and videos, one folder per project
```

Key components: `FeaturedProject` and `ProjectCard` (home cards),
`NumberedCards`, `ProblemSolution`, `MoveComparison`, `SettingGallery`,
`ImageRow`, `StoryBeat`, `RouteTrace`, `ExpandableImage` (click-to-zoom),
`RevealOnScroll` (fade in when scrolled into view).

## 4. Behaviours worth knowing

- **Full-bleed sections** inside the narrow reading column use the
  `relative left-1/2 w-screen -translate-x-1/2` pattern to break out to the
  window's full width.
- **`RevealOnScroll`** fades content in via IntersectionObserver; screenshots
  need a short wait for it.
- **Card covers:** cards use `cardImage ?? image`, so a project page can keep
  one hero and its home card can use another.
- **The meta row** (`Timeline`, `Role`, `Tools` pills) keeps each group on its
  own line and wraps whole groups, never individual pills, when space runs out.
- **Images:** referenced by path from `public/`. Providing a `ratio` on an image
  block reserves its space before load, preventing layout jumps.

## 5. Build and deploy

```bash
npm install
npm run dev        # local dev at http://localhost:3000
npm run build      # static build; also type-checks
```
Push to `master` and Vercel builds and deploys automatically. The build is the
main safety net: a type error in `projects.ts` (e.g. a block missing a required
field) fails it.

## 6. Housekeeping

- `Claude outputs/` (repo root) is scratch space; it should be git-ignored or
  moved out before committing.
- Some image files in `public/projects/` are no longer referenced (e.g.
  `routesetting/card.jpg`, `vmm-website/stories-hero.jpg`, `cards.jpg`,
  `browse.jpg`) and can be deleted once you're sure.
- `src/app/layout.tsx` contains a leftover "Deploy test" comment that can go.
