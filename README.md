# Portfolio

A minimal Next.js 14 + TypeScript + Tailwind CSS starter, laid out for a
personal portfolio with five sections: Design, Videogames, Mobile
Development, AI & ML, and Data Analysis.

## Run it locally

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Edit your content

Everything you need to personalize is in **`src/data/projects.ts`**:
your name, tagline, intro, email, social links, and the project cards in
each of the five categories. No need to touch the components — just edit
that one file and save.

To reorder or rename sections, edit the `categories` array (order in the
array = order on the page).

## Deploy for free

1. Push this folder to a new GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com), sign in with GitHub (free tier,
   no card required).
3. Click **Add New → Project**, import the repo, leave settings as default
   (Vercel auto-detects Next.js), click **Deploy**.
4. You'll get a free `your-project.vercel.app` URL immediately. You can
   attach a custom domain later from the project's Settings → Domains tab
   if you buy one, but it's not required.

Every push to `main` auto-redeploys.

## Structure

```
src/
  app/
    layout.tsx      # page shell + metadata (edit the title/description)
    page.tsx         # assembles the sections
    globals.css
  components/         # Header, Hero, CategorySection, ProjectCard, Contact, Footer
  data/
    projects.ts       # <- edit this for your content
```
