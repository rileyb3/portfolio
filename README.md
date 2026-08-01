# Riley Byers — Portfolio

A Next.js 14 + TypeScript + Tailwind CSS personal portfolio, organized into
five sections: Build, Design, Play, Discover, and Write.

## Run it locally

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Edit your content

Everything you need to personalize is in **`src/data/projects.ts`**:
name, tagline, intro, email, social links, and the project cards in each
of the five categories. No need to touch the components — just edit that
one file and save.

To reorder or rename sections, edit the `categories` array (order in the
array = order on the page). Every project automatically gets its own page
at `/projects/<slug>`, whether or not you give it a custom `slug`.

## Deploy for free

The repo is already connected to GitHub at
[github.com/rileyb3/portfolio](https://github.com/rileyb3/portfolio) on
the `master` branch. To push new changes:

```bash
git add .
git commit -m "Your change"
git push
```

To deploy:

1. Go to [vercel.com](https://vercel.com), sign in with GitHub (free tier,
   no card required).
2. Click **Add New → Project**, import `rileyb3/portfolio`, leave settings
   as default (Vercel auto-detects Next.js), click **Deploy**.
3. You'll get a free `your-project.vercel.app` URL immediately. You can
   attach a custom domain later from the project's Settings → Domains tab
   if you buy one, but it's not required.

Every push to `master` auto-redeploys.

## Structure

```
src/
  app/
    layout.tsx           # page shell + metadata (title/description)
    page.tsx              # homepage — assembles the sections
    globals.css
    [slug]/                # category pages (/build, /design, /play, /discover, /write)
    projects/[slug]/       # individual project detail pages
  components/              # Header, Hero, Intro, Disciplines, SelectedWorks,
                            # CategorySection, ProjectCard, ExpandableImage,
                            # ArtSlideshow, AccentBand, Contact, Footer
  data/
    projects.ts             # <- edit this for your content
```
