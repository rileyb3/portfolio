export type Project = {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  // Optional override for the "View project →" link text on the detail
  // page — e.g. "View publication" for a paper instead of a live app.
  linkLabel?: string;
  // Mark your best 1–2 pieces per discipline as featured — those are the
  // only ones that show up on the homepage. Everything else only shows up
  // once someone clicks into that discipline's own page.
  featured?: boolean;
  // When the same real-world project has its own distinct write-up (and
  // slug) under more than one discipline — AllTrees under both Build and
  // Design, say — set the same waveGroup string on each entry. The sea
  // (seaData.ts) uses this instead of the slug to recognize them as one
  // project, so it still renders as a single multi-color wave that both
  // discipline cards draw a line to, even though each entry now links
  // to its own page. Leave unset for anything with only one write-up.
  waveGroup?: string;
  // Optional cover image shown at the top of the project card.
  // Drop files in public/projects/<slug>/ and reference them as "/projects/<slug>/file.jpg".
  image?: string;
  // Year the project was made — shown on the card and detail page.
  year?: string;
  // If set, the card links to a dedicated /projects/<slug> page instead of
  // `link` or the category page. Give a project a slug once it has enough
  // detail (extra images, a longer writeup) to warrant its own page.
  slug?: string;
  // Longer writeup for the dedicated project page. Falls back to
  // `description` if omitted. Ignored if `body` is set.
  details?: string;
  // Ordered text/image sequence for the dedicated project page — use
  // this instead of `details` when a project needs an image group to
  // sit inline right after the paragraph that references it (e.g. "here
  // are the references I pulled" followed immediately by those images),
  // rather than every image being pushed into one gallery at the very
  // bottom. When set, this replaces `details`/`description` on the
  // project page entirely; `description` is still used for card blurbs
  // elsewhere (category page, homepage).
  body?: Array<
    | { type: "text"; text: string }
    | { type: "images"; images: string[] }
    // Text and a single image side by side (image on the right, text
    // filling the remaining width) on sm+ screens; stacks image-above-
    // text on mobile where there's no room for a row.
    | { type: "text-with-image"; text: string; image: string }
    // Small-caps section label breaking the writeup into named chunks
    // (e.g. "THE PROCESS") — case-study style, modeled after
    // angelechendesigns.com's project pages.
    | { type: "heading"; text: string }
    // Breaks out of the article's max-w-3xl column to render near
    // full-viewport-width — for a single reveal/hero-ish image that
    // should read as a bigger moment than the inline gallery grid.
    // `bleed` drops the 85vh height cap so the image fills the full
    // viewport width edge to edge instead of being letterboxed inside it.
    // For wide source images where the subject is a small part of the
    // frame (e.g. a phone centered in a simulator capture) and every
    // pixel of width counts.
    | { type: "full-image"; image: string; bleed?: boolean }
    // Full-bleed draggable before/after comparison slider.
    | { type: "before-after"; before: string; after: string }
    // Labeled row of pill chips (e.g. "Goals: Low Budget, Wall Mural...")
    // for calling out a short list without a full paragraph.
    | { type: "pills"; label: string; items: string[] }
    // Renders the project's top-level `palette` swatch strip inline,
    // wherever it's placed in the body — e.g. right under the paragraph
    // that actually talks about the palette, instead of always pinned
    // near the top of the page regardless of what the writeup says.
    | { type: "palette" }
    // Full-bleed, continuously auto-scrolling strip of progress photos —
    // same looping-marquee technique as the homepage's TechMarquee, just
    // images instead of logo pills.
    | { type: "slideshow"; images: string[] }
    // A named "beat" (kicker + big statement, optional image) that
    // inverts to the light theme as a deliberate rhythm-break — the
    // "THE PROBLEM" / "THE SOLUTION" moments from a case-study page like
    // angelechendesigns.com/bink. See StoryBeat.tsx.
    | {
        type: "beat";
        kicker: string;
        heading: string;
        text?: string;
        image?: string;
        imageRatio?: number;
        invert?: boolean;
      }
    // Reference images landing in a loose, overlapping pile rather than a
    // tidy grid — for a "gathering research" moment. See ImagePile.tsx.
    | { type: "image-pile"; images: string[] }
    // Full-bleed video with playback controls — e.g. real screen-recorded
    // process footage, not just a finished-product demo.
    | { type: "video"; src: string; poster?: string }
    // Gantt-style project timeline — phases across the top, staggered task
    // bars underneath. See ProjectTimeline.tsx. `span` is in grid columns;
    // the chart's column count is the sum of the phase spans, so pick a
    // resolution (months, half-months) and lay both out against it.
    | {
        type: "timeline";
        kicker?: string;
        heading?: string;
        phases: { label: string; span: number; note?: string }[];
        tasks: { label: string; start: number; span: number }[];
      }
    // Full-bleed band of numbered cards — findings, methods, decisions.
    // See NumberedCards.tsx.
    | {
        type: "cards";
        label?: string;
        columns?: 2 | 3 | 4;
        items: { title: string; subtitle?: string; text: string }[];
      }
  >;
  // When true, the project's cover `image` renders full-bleed ABOVE the
  // title/tags/meta block instead of below it — "one big, simple picture
  // first, then scroll for the quick description" per angelechendesigns
  // .com/bink's opening beat. Opt-in per project so every other page
  // keeps its current title-first layout.
  heroImageFirst?: boolean;
  // Short label/value pairs shown in a row near the top of the project
  // page (e.g. TIME, TOOLS, ROLE) — same idea as the meta row on
  // angelechendesigns.com's case studies.
  meta?: { label: string; values: string[] }[];
  // Hex colors rendered as a rounded strip of solid swatches under a
  // "Palette" label, in the given order — for projects where the color
  // palette itself is worth showing rather than just naming.
  palette?: string[];
  // Extra images shown in a gallery on the dedicated project page.
  gallery?: string[];
  // A representative code snippet shown on the dedicated project page.
  codeSnippet?: {
    label: string;
    code: string;
  };
  // Short reflection shown on the dedicated project page. All optional —
  // fill in whichever are true for a given project.
  reflection?: {
    proudOf?: string; // what you're most proud of
    learned?: string; // the main thing you learned
    redo?: string; // what you'd change if you did it again
  };
  // Watchable video shown on the dedicated project page, e.g.
  // "/projects/<slug>/file.mp4". Use `image` as its poster/thumbnail.
  video?: string;
  // Optional subheading to group this project under within its category
  // page (e.g. "3D Animation" vs "Video Art" within Play). Projects without
  // a section render together with no heading, same as before.
  section?: string;
  // A more specific label than the discipline name, shown anywhere the
  // category badge appears outside the category page itself (Experience
  // list, homepage cards, project detail page) — e.g. "iOS Build" instead
  // of "Build", "Video Art" instead of "Play". Falls back to the plain
  // category label if unset.
  tagLabel?: string;
};

export type SlideImage = {
  src: string;
  // Optional name for this specific piece, shown over the image.
  name?: string;
};

export type Slideshow = {
  title: string;
  // Caption for the section as a whole, shown under the title.
  caption?: string;
  images: SlideImage[];
  // Optional skills/tools used for this slideshow's work — rolled up into
  // the category's skills chips alongside project tags.
  tags?: string[];
};

export type Category = {
  id: string;
  label: string;
  blurb: string;
  // Optional short statement shown under the header on this category's
  // page — a line of intent, not a description.
  tagline?: string;
  projects: Project[];
  // Optional slideshows shown on this category's page, above the project
  // grid. Each has its own title, so you can add more later (e.g. a
  // separate one for photography). Drop image files in public/art/ and
  // list their paths in the order they should play.
  slideshows?: Slideshow[];
};

// Edit this file to swap in your real projects.
// `label` is the short, on-brand word shown on the button/card.
// `blurb` is the literal discipline name shown inside the section itself,
// so the site stays personal up top and clear once you're in it.
export const categories: Category[] = [
  {
    id: "build",
    label: "Build",
    blurb: "Software & Engineering",
    projects: [
      {
        title: "AllTrees",
        description:
          "Think Mountain Project, but for trees. A community map where climbers discover, log, and review climbable trees — currently in first-round beta.",
        tagLabel: "iOS Build",
        featured: true,
        waveGroup: "alltrees",
        // Vertical-story treatment, same pattern as Voices Meet Minds and
        // Interior Design: heroImageFirst opens full-bleed on the app icon
        // (a single clean graphic mark, same role the finished mascot/room
        // photo played on those pages), then every named section below is
        // a StoryBeat. Screenshots throughout are real app screens, not
        // mockups — some carry obvious placeholder/test data (e.g. "(test)
        // :0" as a tree name) since this is still first-round beta.
        heroImageFirst: true,
        body: [
          {
            type: "beat",
            kicker: "The Problem",
            heading:
              "Climbers have Mountain Project. Trees don't have anything like it.",
            text: "I climb trees recreationally, and there was no way to find one, rate it, or see what other climbers already knew about it.",
          },
          {
            type: "beat",
            kicker: "The Solution",
            heading:
              "AllTrees — a community map where climbers discover, log, and review climbable trees.",
            image: "/projects/alltrees/map.jpg",
            imageRatio: 700 / 1387,
          },
          {
            type: "beat",
            kicker: "The Tree Page",
            heading:
              "Every tree gets its own page: a star rating, a leaf-icon difficulty scale, who claimed the first ascent, and live-reported conditions.",
            image: "/projects/alltrees/tree-detail.jpg",
            imageRatio: 700 / 1387,
          },
          {
            type: "beat",
            kicker: "The Discovery",
            heading:
              "An AI species ID feature and a \"For You\" feed help climbers find their next tree, not just revisit ones they already know.",
            text: "Species ID runs on the Claude API, weighted by GPS location, so a single photo can suggest the most likely species nearby.",
            image: "/projects/alltrees/explore-feed.jpg",
            imageRatio: 700 / 1387,
          },
          {
            type: "images",
            images: [
              "/projects/alltrees/search-filters.jpg",
              "/projects/alltrees/search-radius.jpg",
            ],
          },
          {
            type: "beat",
            kicker: "The Profile",
            heading:
              "A profile system tracks real climbing stats and assigns every climber an archetype — mine's currently \"The Treecreeper.\"",
            image: "/projects/alltrees/stats.jpg",
            imageRatio: 700 / 1387,
          },
          {
            type: "beat",
            kicker: "The Result",
            heading:
              "Still in first-round beta — the map, tree pages, ascent logging, search, and profile system are all built and live.",
            text: "No usage data yet, but the foundation works end to end.",
          },
        ],
        tags: [
          "React Native",
          "Expo",
          "TypeScript",
          "Supabase",
          "PostgreSQL",
          "Mapbox",
          "Claude API",
          "RevenueCat",
        ],
        year: "2026",
        slug: "alltrees",
        image: "/projects/alltrees/icon.jpg",
        // Return leg of the Design ⇄ Build pair. The link renderer spots
        // an internal href and swaps the new-tab <a> for a same-tab
        // next/link, then names the destination discipline in the pill.
        link: "/projects/alltrees-design",
        linkLabel: "view this project from another perspective",
        codeSnippet: {
          label: "Supabase Edge Function — keeping the Claude API key server-side",
          code: `// Species ID runs through an Edge Function instead of calling the
// Anthropic API directly from the client, so the API key never ships
// in the app bundle.
Deno.serve(async (req) => {
  const { imageBase64, lat, lng } = await req.json();

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 300,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } },
          { type: "text", text: \`Suggest the 3 most likely tree species for this photo, weighted by likelihood near \${lat}, \${lng}.\` },
        ],
      }],
    }),
  });

  return new Response(await response.text(), {
    headers: { "content-type": "application/json" },
  });
});`,
        },
        reflection: {
          proudOf:
            "Building something real out of nothing but an idea. Some days I was so locked into it I didn't want to work on anything else; other days it was hours of pushing through debugging just to move an inch. Getting it all the way from a concept to a working app, end to end, is what I'm most proud of.",
          learned:
            "A lot about working with APIs — both calling Anthropic's for species ID and designing my own Supabase Edge Functions around it — and about Git for managing a codebase this size over time. Mostly, though, I learned how many separate pieces have to be made to work together for an app to function at all: the database, auth, maps, payments, and AI calls all talking to each other correctly. Things like row-level security policies, unique constraints to stop duplicate reviews, a custom Expo config plugin to persist CocoaPods settings, and the EAS-to-TestFlight pipeline that ties it all into a shippable build.",
        },
      },
      {
        title: "This Portfolio",
        description:
          "The site you're looking at right now — hand-built in Next.js, with everything you're browsing pulled from one typed data file.",
        tagLabel: "Web Build",
        // Cover is the current homepage; the body images are the earlier
        // versions it passed through on the way here.
        heroImageFirst: true,
        image: "/projects/portfolio/cover.jpg",
        body: [
          {
            type: "text",
            text: "The site you're looking at right now — hand-built in Next.js, with everything you're browsing pulled from one typed data file.",
          },
          {
            type: "text",
            text: "Earlier versions, in the order they happened.",
          },
          // Full-bleed, one after another, so each earlier version gets
          // its own immersive beat instead of piling into a small grid.
          { type: "full-image", image: "/projects/portfolio/01-hero-photo.jpg" },
          { type: "full-image", image: "/projects/portfolio/02-hero-quote.jpg" },
          { type: "full-image", image: "/projects/portfolio/03-discipline-stars.jpg" },
          { type: "full-image", image: "/projects/portfolio/04-discipline-pills.jpg" },
        ],
        tags: ["TypeScript", "Next.js", "Tailwind CSS"],
        link: "#",
      },
      {
        title: "Routesetting",
        description:
          "Designing boulder problems and routes at three different gyms — same holds, same wall, a hundred ways to get the movement wrong.",
        tagLabel: "Routesetting",
        waveGroup: "routesetting",
        heroImageFirst: true,
        body: [
          {
            type: "text",
            text: "I set boulder problems and routes at three different gyms: Active Climbing in Athens, GA, the Brandeis Climbing Wall in Waltham, MA, and Central Rock Gym in Watertown, MA. Setting is its own kind of design problem — working within a fixed set of holds and a wall's geometry to build movement that reads clearly at a given grade, feels good in the body, and doesn't have an accidental easier way through it.",
          },
          {
            type: "images",
            images: [
              "/projects/routesetting/route-1.jpg",
              "/projects/routesetting/route-2.jpg",
            ],
          },
        ],
        tags: ["Routesetting"],
        image: "/projects/routesetting/cover.jpg",
        video: "/projects/routesetting/setting.mp4",
        slug: "routesetting",
        link: "/projects/route-design",
        linkLabel: "view this project from another perspective",
      },
      {
        title: "Wall Book Holders",
        description:
          "A 3D-printed mount that holds your book open to the page — no drilling, no bookmark, no losing your spot.",
        tagLabel: "3D Print Build",
        heroImageFirst: true,
        body: [
          {
            type: "text",
            text: "A set of wall-mounted book holders that keep a book open to your place, designed in Fusion 360 and 3D printed. Each one is designed to install with Command Velcro strips rather than hardware, so it goes up (and comes down) without putting holes in the wall.\n\nEach bracket prints in two flat halves that slot together and get glued into one rigid piece — easier to print reliably than the full 3D shape in one go, and it keeps the print time and material down.",
          },
          {
            type: "images",
            images: [
              "/projects/book-holder/shelves.jpg",
              "/projects/book-holder/render.png",
            ],
          },
        ],
        tags: ["Fusion 360", "3D Printing"],
        year: "2024",
        slug: "wall-book-holders",
        image: "/projects/book-holder/room.jpg",
        reflection: {
          redo:
            "Right now they only really hold light books. If I kept going, I'd run the actual calculations on how much weight the brackets can take, and probably extend the vertical supports to handle heavier ones.",
        },
      },
      {
        title: "Digital Clock",
        description:
          "A stock clock kit given a custom black-and-gold case — designed from scratch to be the one piece of hardware you'd actually want on your wall.",
        tagLabel: "Hardware Build",
        heroImageFirst: true,
        body: [
          {
            type: "text",
            text: "For an electrical engineering class, I built a functioning digital clock using a WHDTS 4-bit electronic clock DIY kit as the electronics base, then designed and 3D printed a custom case for it in Fusion 360 rather than using the kit's stock housing.\n\nThe brief I set for myself: a minimalist case with easy-to-reach buttons, a clearly visible clock face, and a design that never needs to come off the clock. I researched hinge and enclosure ideas before sketching out several case concepts by hand, then modeled the final version — a faceted black case with gold trim, a cutout window for the display, and two accessible buttons — piece by piece in Fusion 360.",
          },
          {
            type: "images",
            images: [
              "/projects/clock/brainstorm.jpg",
              "/projects/clock/technical-drawing.jpg",
            ],
          },
        ],
        tags: ["Fusion 360", "3D Printing", "Circuit Assembly", "Soldering"],
        year: "2019",
        slug: "digital-clock",
        image: "/projects/clock/render-hero.jpg",
        reflection: {
          proudOf:
            "How the case turned out — a minimalist black-and-gold design where the clock face stays clearly visible and the buttons are easy to reach, built entirely around someone else's electronics kit rather than a blank slate.",
          learned:
            "How to design a case around hardware I didn't build myself — measuring the board and components, planning cutouts for the display and buttons, and running into real 3D-printing tolerances: parts that fit together perfectly in Fusion 360 didn't always fit once printed, and I had to reprint a few.",
          redo:
            "I'd scale the design up some so the smaller parts stayed structurally sound, and give a few pieces more precise measurements — that's what caused the reprints.",
        },
      },
      {
        title: "3D Printer Filament Stand",
        description:
          "The filament used to live across the room from the printers that needed it. A classmate and I fixed that.",
        tagLabel: "3D Print Build",
        heroImageFirst: true,
        body: [
          {
            type: "text",
            text: "For a shop class project, I was tasked with improving how our engineering room stored 3D-printer filament — at the time it lived in a separate area and had to be sorted through and carried to the printers for every print. Working with a classmate, I designed a stand that holds multiple spools directly above the printers, attaches to the printer enclosure frame, and keeps spools locked in place but removable by hand.\n\nI researched lazy susans (which use bearings to spin) and the filament connectors already built into the printers before sketching a rotating, tiered stand concept. In the end we moved away from the lazy susan plan and designed a snap-lock piece modeled after the connector the printers already used, built into the existing structure around the printers rather than a freestanding base — that gave the heaviest, fully-loaded spools much more support.",
          },
          {
            type: "images",
            images: [
              "/projects/filament-holder/brainstorm.jpg",
              "/projects/filament-holder/render-lock.jpg",
            ],
          },
        ],
        tags: ["Fusion 360", "3D Printing", "CAD"],
        year: "2019",
        slug: "filament-stand",
        image: "/projects/filament-holder/render-stand.jpg",
      },
    ],
  },
  {
    id: "design",
    label: "Design",
    blurb: "Design",
    // Visual art slideshows — drop image files in public/art/ and list them
    // here in the order they should play. Add more entries to this array
    // for other slideshows (e.g. photography).
    slideshows: [
      {
        title: "Painting",
        tags: ["Krita"],
        images: [
          { src: "/art/hawk.jpg" },
          // { src: "/art/owl.jpg" }, — add once you resend the owl painting
          { src: "/art/asparagus.jpg" },
          { src: "/art/octopus.jpg" },
          { src: "/art/leopard.jpg" },
          { src: "/art/red-portrait.jpg" },
          { src: "/art/two-figures.jpg" },
          { src: "/art/pink-hair-portrait.jpg" },
          { src: "/art/bird.jpg" },
          { src: "/art/abstract-blue-yellow.jpg" },
          { src: "/art/abstract-bw.jpg" },
          { src: "/art/abstract-green.jpg" },
          { src: "/art/abstract-rainbow-swirl.jpg" },
          { src: "/art/abstract-watercolor.jpg" },
          { src: "/art/abstract-bw-stripes.jpg" },
          { src: "/art/mural-herons-wip.jpg" },
        ],
      },
      {
        title: "Henna",
        caption:
          "Mostly freehand, with the occasional reference image — often prompted by a single word.",
        images: [
          { src: "/art/henna/swirl-forearm.jpg", name: "Joy" },
          { src: "/art/henna/hawk-forearm.jpg" },
          { src: "/art/henna/thorn-hand.jpg" },
          { src: "/art/henna/vine-forearm-2.jpg" },
          { src: "/art/henna/two-hands.jpg" },
          { src: "/art/henna/floral-panel.jpg" },
          { src: "/art/henna/leaf-shoulder.jpg" },
          { src: "/art/henna/hand-eye-shoulder.jpg", name: "Spruce Tips" },
          { src: "/art/henna/vine-forearm.jpg", name: "Spruce Tips" },
          { src: "/art/henna/script-forearm.jpg", name: "Dragon" },
          { src: "/art/henna/henna-hands-detail.jpg" },
          { src: "/art/henna/fresh-paste-forearm.jpg" },
          { src: "/art/henna/henna-application.jpg", name: "Steel" },
        ],
      },
    ],
    // Rendered in the order given — see CategorySection, no separate
    // sort applied. Ordered newest-first by hand: VMM and AllTrees (both
    // 2026), then Route Design (ongoing — three gyms, present tense in
    // the copy), Pete the Snail (2023, same year as the Play entry), and
    // Interior Design (2022). Keep new entries in that order rather than
    // appending, since nothing here sorts for you.
    projects: [
      {
        title: "Voices Meet Minds Branding",
        description:
          "A caterpillar mascot for Voices Meet Minds' newsletter, part of a branding and website refresh I'm leading for the org.",
        year: "2026",
        // Vertical-story layout — card.jpg (the finished mascot) opens
        // full-bleed with no text on it and a bouncing down-arrow cue
        // (see heroImageFirst + the ChevronDown in page.tsx), then title/
        // tags, then every section below uses the same StoryBeat kicker+
        // heading typography (no more mixing that with the old small-caps
        // `heading` block type — that inconsistency was the actual bug in
        // the first pass, not a rendering failure).
        //
        // The finished character (card.jpg / mascot.jpg) only appears at
        // the very top and in the closing "Result" beat — iteration-4,
        // which is essentially the final design, is deliberately left out
        // of the mid-page grid so it doesn't show up a third time.
        //
        // TODO(riley): no TIME/TOOLS/ROLE meta row yet — didn't want to
        // guess at facts. Give me those three and it's a one-line add via
        // the `meta` field above.
        heroImageFirst: true,
        body: [
          {
            type: "text",
            text: "Voices Meet Minds (VMM) is an organization focused on community building, storytelling and education of mental health topics. I'm leading a branding and website refresh for them — this is the first piece: a caterpillar mascot for their newsletter.",
          },
          {
            type: "beat",
            kicker: "The Task",
            heading: "Create a caterpillar mascot for their newsletter.",
          },
          {
            type: "beat",
            kicker: "The Approach",
            heading:
              "VMM's existing mark is a butterfly. A caterpillar is the same creature, one stage earlier — it stays on-brand instead of introducing a new character.",
            image: "/projects/voices-meet-minds/logo.png",
            imageRatio: 2332 / 1118,
          },
          {
            type: "beat",
            kicker: "The Research",
            heading:
              "I gathered reference across mascot styles and real caterpillar anatomy to nail down the shape, face, and personality.",
          },
          {
            type: "image-pile",
            images: [
              "/projects/voices-meet-minds/research/ref-vmm-badge.png",
              "/projects/voices-meet-minds/research/ref-leaf-caterpillar-eye-study.png",
              "/projects/voices-meet-minds/research/ref-swallowtail-osmeterium.png",
              "/projects/voices-meet-minds/research/ref-clipart-flat.png",
              "/projects/voices-meet-minds/research/ref-3d-character.png",
              "/projects/voices-meet-minds/research/ref-very-hungry-caterpillar.png",
              "/projects/voices-meet-minds/research/ref-cartoon-round-antennae.png",
              "/projects/voices-meet-minds/research/ref-clipart-googly-eyes.png",
            ],
          },
          {
            type: "beat",
            kicker: "The Ideation",
            heading:
              "From that reference, a full page of quick Procreate sketches to find the right silhouette before touching Figma.",
          },
          {
            type: "full-image",
            image: "/projects/voices-meet-minds/ideation/procreate-sketches.jpg",
          },
          {
            type: "beat",
            kicker: "The Iterations",
            heading:
              "Body segments, feet, resting pose, and face — I tested each decision through several passes in Figma before locking in the final character.",
          },
          {
            type: "images",
            images: [
              "/projects/voices-meet-minds/iteration-1.png",
              "/projects/voices-meet-minds/iteration-2.png",
              "/projects/voices-meet-minds/iteration-3.png",
            ],
          },
          {
            // Autoplaying GIF, not a <video> — a GIF just plays on its own
            // as a plain image with zero JS/controls, which is simpler and
            // more reliable than fighting browser autoplay-with-sound
            // restrictions on a real <video> element. Trimmed to the 5
            // seconds (10s-15s) of the original recording that's actually
            // worth looping.
            type: "full-image",
            image: "/projects/voices-meet-minds/process/figma-edit.gif",
          },
          {
            type: "beat",
            kicker: "The Result",
            heading:
              "A friendly, on-brand mascot, ready for VMM's newsletter.",
            text: "Next up: a refresh of VMM's website.",
            image: "/projects/voices-meet-minds/mascot-final-blue.png",
            imageRatio: 1222 / 1156,
          },
        ],
        tags: ["Branding", "Character Design", "Mascot Design"],
        // 16:9 (padded with the character art's own near-black background,
        // not cropped) so the card thumbnail's aspect-video/object-cover
        // box (see ProjectCard.tsx) shows the whole character instead of
        // cutting off his feet. Also doubles as the opening full-bleed
        // hero via heroImageFirst. mascot-final-blue.png is the source —
        // this blue colorway is the actual final pick, replacing the
        // earlier green version (which only remains as an iteration).
        image: "/projects/voices-meet-minds/card-final-blue.jpg",
        slug: "voices-meet-minds",
      },
      {
        // Renamed from "UI/UX Design" — this now has its own slug and its
        // own write-up (the design/UI perspective), separate from the app
        // build page. Same cover image as the Build AllTrees card — it's
        // the same app icon, just a different lens on the same project.
        title: "AllTrees",
        description:
          "The interface behind AllTrees, designed in Figma before any code was written.",
        tags: ["UI/UX"],
        slug: "alltrees-design",
        // Same waveGroup as the Build entry — the sea still recognizes
        // these as one project and draws a two-color wave for it, even
        // though each links to its own page now.
        waveGroup: "alltrees",
        featured: true,
        heroImageFirst: true,
        image: "/projects/alltrees/icon.jpg",
        year: "2026",
        meta: [
          { label: "Timeline", values: ["Apr – Sep 2026", "6 months"] },
          {
            label: "Role",
            values: ["Solo designer & developer", "3-person ideation"],
          },
          { label: "Tools", values: ["Figma", "Mapbox", "Supabase", "Expo"] },
        ],
        body: [
          {
            type: "text",
            text: "AllTrees is a community map for tree climbers — find a tree, log an ascent, review it, and see what other climbers already knew about it. This page is the design side of the project: how the scope got set, what the research actually was, and what changed because of it. The engineering write-up lives on the Build page.",
          },

          // ---- Timeline ----------------------------------------------
          // Six months at half-month resolution: 12 columns, two per
          // month, so tasks can overlap phase boundaries the way they
          // really did rather than snapping to tidy month blocks.
          {
            type: "timeline",
            kicker: "Project Timeline",
            heading:
              "A six-month project that started as a voice note on the way back from a climbing competition, and is now in its second beta.",
            phases: [
              { label: "Ideation", span: 2, note: "April 2026" },
              { label: "Resource Research", span: 2, note: "May 2026" },
              { label: "Build", span: 2, note: "June 2026" },
              { label: "Testing & Ideation", span: 2, note: "July 2026" },
              { label: "Beta One", span: 2, note: "August 2026" },
              { label: "Beta Two", span: 2, note: "September 2026" },
            ],
            tasks: [
              { label: "Voice-note ideation session", start: 1, span: 1 },
              { label: "Competitive framing", start: 1, span: 2 },
              { label: "Core feature scoping", start: 2, span: 2 },
              { label: "Map SDK evaluation", start: 3, span: 1 },
              { label: "Backend & auth evaluation", start: 3, span: 2 },
              { label: "Icon & pin design in Figma", start: 4, span: 2 },
              { label: "Map & pin drop", start: 5, span: 2 },
              { label: "Tree profile pages", start: 6, span: 2 },
              { label: "Ascent logging", start: 6, span: 2 },
              { label: "Search & filters", start: 7, span: 2 },
              { label: "Self-testing & refinement", start: 7, span: 2 },
              { label: "Network ideation", start: 8, span: 1 },
              { label: "Advisor session", start: 8, span: 1 },
              { label: "Treemium scoping", start: 8, span: 2 },
              { label: "Beta one", start: 9, span: 2 },
              { label: "Feedback synthesis", start: 10, span: 1 },
              { label: "Fixes & refinements", start: 10, span: 2 },
              { label: "Beta two", start: 11, span: 2 },
            ],
          },

          // ---- Ideation ----------------------------------------------
          {
            type: "beat",
            kicker: "Ideation",
            heading:
              "Three climbers, one voice note, and a gap that neither Mountain Project nor AllTrails fills.",
            text: "The idea got worked out on the drive back from a climbing competition, with two other climbers, recorded as a voice note. We used Mountain Project and AllTrails as the reference points — both prove that a community-maintained map of outdoor features works, and neither one has any concept of a climbable tree.",
          },
          {
            type: "cards",
            label: "What that session settled",
            items: [
              {
                title: "The map comes first",
                subtitle: "Non-negotiable",
                text: "A community map where any user can drop a pin. Everything else in the app is downstream of it — without user-added pins there is nothing to look at, so no other feature could be allowed to compete for build time.",
              },
              {
                title: "Then a page per tree",
                subtitle: "Second priority",
                text: "Every pin needs somewhere to land: a profile page for the tree itself, so a pin is a record rather than a dot. Rating, difficulty, conditions, who climbed it first.",
              },
              {
                title: "Then people, if it isn't too hard",
                subtitle: "Conditional",
                text: "User profiles and everything social were explicitly deferred behind the first two — worth building only if the map and tree pages came together without eating the whole timeline. They did, so they got built.",
              },
            ],
          },

          // ---- Resource research -------------------------------------
          {
            type: "beat",
            kicker: "Resource Research",
            heading:
              "A month spent picking what the app would stand on, before writing anything that would be expensive to undo.",
            text: "Four decisions were load-bearing enough that changing them later would have meant a rewrite. Each one was made against the specific thing AllTrees needed rather than general popularity.",
          },
          {
            type: "cards",
            label: "The four load-bearing choices",
            items: [
              {
                title: "Mapbox",
                subtitle: "over Google Maps & Apple MapKit",
                text: "The map isn't a utility here, it's the product — so it had to look like AllTrees, not like a road atlas. Mapbox restyles vector tiles down to the individual layer, so the map could be pulled green and tree-forward with no custom assets. Google and Apple both hand you their look with only cosmetic control over it.",
              },
              {
                title: "Supabase",
                subtitle: "over Firebase",
                text: "\"Trees near me\" is a geographic query, and Postgres does those natively — searching by radius is a real query rather than something faked client-side. Row-level security means a climber can only edit their own entries, enforced at the database instead of trusted to the app. Auth, storage and edge functions in one service, which matters when the team is one person.",
              },
              {
                title: "Figma",
                subtitle: "Design system & iconography",
                text: "The map needed its pins, leaf icons and badges drawn before any of them could be built — a pin is the smallest, most repeated element in the app and the hardest to fix later. Screens iterate in minutes there and in hours in code.",
              },
              {
                title: "RevenueCat",
                subtitle: "Subscriptions",
                text: "Receipt validation, restore-purchases, trial states and cancellations are a long tail of edge cases that have nothing to do with tree climbing. RevenueCat collapses all of it into a single entitlement flag the app can read.",
              },
            ],
          },

          // ---- Testing & network ideation ----------------------------
          {
            type: "beat",
            kicker: "Testing & Network Ideation",
            heading:
              "I climbed with it, fixed what annoyed me, then went and asked people what would make it worth paying for.",
            text: "July was the first month the app was complete enough to properly use. Most of the bug-catching happened at home, working through the app screen by screen, with some of it out while looking for trees. In parallel I started asking my network what they'd actually value — which is where the business model got decided for me.",
          },
          {
            type: "beat",
            kicker: "Monetisation",
            heading:
              "The plan was a Kickstarter. I went with a premium tier instead.",
            text: "I ran it past my brother, who's the COO of an e-commerce services company. He suggested a paid feature rather than crowdfunding, and pointed out that the app needed to be easy to share.",
          },
          {
            type: "cards",
            label: "What changed as a result",
            columns: 2,
            items: [
              {
                title: "A premium tier, not a Kickstarter",
                subtitle: "Monetisation",
                text: "A Kickstarter asks strangers to fund something that doesn't exist yet; a premium tier asks people already using the app to pay for something they can see working. I dropped the Kickstarter and scoped Treemium in its place — $1.99/month or $14.99/year, with a 7-day trial.",
              },
              {
                title: "Make it easy to share",
                subtitle: "Growth",
                text: "His other point was that growth would more likely come from climbers showing the app to other climbers than from advertising. That moved sharing up the priority list: shareable profile cards, tree links that open straight to the right pin, and share buttons on the screens people are proudest of.",
              },
            ],
          },

          // ---- Treemium ----------------------------------------------
          {
            type: "beat",
            kicker: "Treemium",
            heading:
              "Every core feature stays free. What you pay for is the part that's fun to show people.",
            text: "The constraint I set was that nothing load-bearing — the map, adding trees, tree pages, logging ascents, search — could ever sit behind the paywall. A community map with a paywalled community is just a worse map. So Treemium had to be built out of things that are desirable without being necessary.",
          },
          {
            type: "cards",
            label: "Three paid features, chosen for two different reasons",
            items: [
              {
                title: "Custom pins",
                subtitle: "Retention",
                text: "Nine leaf shapes, one per botanical family — oak, maple, pine, birch, willow, apple, hickory, sycamore, magnolia — and each is unlocked by actually climbing a tree from that family. That makes them a reason to keep climbing rather than a cosmetic you buy once and forget.",
              },
              {
                title: "The climber archetype",
                subtitle: "Desire",
                text: "The stats page scores six behavioural axes from your logged ascents — risk, novelty, range, diversity, difficulty and dedication — and resolves them into one of ten animals, from the Sloth to the Leopard. It's the feature I expect people to want because someone else has one and they don't.",
              },
              {
                title: "For You",
                subtitle: "Utility",
                text: "Personalised tree recommendations, weighted by where you climb and what you've climbed before. The one paid feature that's genuinely useful rather than expressive — included so the tier isn't purely decorative.",
              },
            ],
          },
          {
            type: "text-with-image",
            text: "The six axes rendered as a radar chart, so the archetype is shown being derived rather than just asserted. Mine currently resolves to The Treecreeper — high diversity, high dedication, low risk — which is an accurate enough read that it was faintly annoying.",
            image: "/projects/alltrees-design/stats-radar.jpg",
          },

          // ---- Beta one ----------------------------------------------
          {
            type: "beat",
            kicker: "Beta One",
            heading:
              "Four testers: the two climbers who scoped it, and two UX designers who hadn't.",
            text: "A four-person panel is small, so it was split deliberately rather than gathered conveniently — half with the full context of what the app was meant to become, half coming to it fresh.",
          },
          {
            type: "cards",
            label: "The panel",
            columns: 2,
            items: [
              {
                title: "Two climbers",
                subtitle: "The original ideation group",
                text: "The same two climbers from the April voice note. They knew exactly what the app had been meant to become, which made them the only people who could spot where the build had quietly drifted from the plan.",
              },
              {
                title: "Two UX designers",
                subtitle: "Friends in tech, two other cities",
                text: "Both with UX backgrounds, one of them a climber as well. Neither had been part of the original scoping, so they read the app as an interface rather than as the thing we'd planned — and caught the usability problems the others had already learned to work around.",
              },
            ],
          },
          {
            type: "text",
            text: "Feedback arrived as a mix of written notes and calls. What follows is the written half — the part I have an exact record of — rather than everything that was said. The useful notes were unglamorous: specific, fixable problems, each of which shipped a change.",
          },
          {
            type: "text",
            text: '"There\'s no option to collapse the keyboard back down when you finish typing a review, which makes the formatting a little weird." — added a collapsible keyboard.\n\n"It isn\'t obvious that logging a tree doesn\'t mean you\'re also logging the first ascent. Could there be a pop up after you post a tree that asks if you want to log the first ascent?" — added that pop-up.\n\n"The option to edit my profile picture is not clickable." — fixed.\n\n"The badges are so cute!" / "Huge fan of the tree name generator" — good signs that the small details are landing.',
          },
          {
            type: "beat",
            kicker: "The Fix With A Picture",
            heading:
              "\"Like white on green instead of green on green.\"",
            text: "The tab bar had been dark green on green since the first build, and I'd stopped seeing it — it was legible to me because I already knew what the icons said. The icons and labels went white, and the active tab kept the bright green so it still reads as selected. Drag the slider.",
          },
          // Same crop from the same screen on the same device, so the two
          // halves line up exactly under the slider — the only thing that
          // moves is the thing that actually changed.
          {
            type: "before-after",
            before: "/projects/alltrees-design/tabbar-before.jpg",
            after: "/projects/alltrees-design/tabbar-after.jpg",
          },

          // ---- The login redesign ------------------------------------
          {
            type: "beat",
            kicker: "The Login Screen",
            heading: "A redesigned login screen, with a \"last used\" indicator.",
            text: "The old layout wasn't working, so I reworked it — one tap back in, instead of hunting for which sign-in method you used last time. Four sign-in paths, including a guest mode so the map can be browsed before committing to an account.",
          },
          // The "before" runs inline and small, the "after" full-bleed
          // underneath — so the comparison reads as an escalation rather
          // than showing the same screen twice at the same weight.
          {
            type: "text-with-image",
            text: "Before: three full-width buttons stacked down the screen, guest access demoted to a small underlined link at the bottom, and nothing to indicate which method you'd used last time. It worked, but every return visit was a small guessing game — and the one option that lets someone look around before committing was the easiest one to miss.",
            image: "/projects/alltrees-design/login-before.jpg",
          },
          // Full-bleed rather than an `image` on the beat above: the beat
          // caps its image at the article's max-w-2xl column, which shrinks
          // a full-screen capture down to thumbnail size and loses the point.
          {
            type: "full-image",
            image: "/projects/alltrees-design/login.jpg",
            bleed: true,
          },

          // ---- Beta two ----------------------------------------------
          {
            type: "beat",
            kicker: "Beta Two — Running Now",
            heading:
              "The second round isn't testing whether it works. It's testing whether the map fills up.",
            text: "Round one was bug discovery on a panel that already believed in the idea. Round two is the harder question: will climbers who weren't in the room add trees without being asked? So this round has a number attached rather than a feeling — 25 testers, and 100 trees on the map by the end of it.",
          },
          {
            type: "cards",
            label: "What round two has to prove",
            columns: 2,
            items: [
              {
                title: "25 testers",
                subtitle: "Recruiting now",
                text: "Large enough that a complaint repeated three times is a pattern rather than one person's taste, small enough that every piece of feedback still gets read properly. Recruiting through the gyms I set at and the competition circuit — climbers who already travel to climb are the ones who'll add pins in places I'll never get to.",
              },
              {
                title: "100 trees on the map",
                subtitle: "The real measure",
                text: "The map is the product, and an empty map is just a demo. The number that matters isn't installs or session length, it's whether pins appear in places I've never been — which is the only evidence that this works as a community map rather than as my personal tree diary.",
              },
            ],
          },

          // ---- Feature details ---------------------------------------
          // Riley's request: the feature-by-feature detail sits AFTER the
          // research narrative, so the page argues for the decisions first
          // and only then shows what got built.
          {
            type: "heading",
            text: "The Features",
          },
          {
            type: "text",
            text: "What the research above actually turned into, in the order the ideation session prioritised them.",
          },
          {
            type: "cards",
            label: "The map, and everything downstream of it",
            items: [
              {
                title: "The map",
                subtitle: "Priority one from day one",
                text: "A community map of climbable trees, where any climber can drop a pin at their location or place one by hand. Custom-styled so the map reads as woodland rather than road network.",
              },
              {
                title: "Tree pages",
                subtitle: "Priority two",
                text: "Every tree gets a profile: a star rating, a leaf-icon difficulty scale, who claimed the first ascent, live-reported conditions, and reviews from other climbers.",
              },
              {
                title: "Ascent logging",
                subtitle: "The core loop",
                text: "Log an ascent against a tree, separately from adding the tree itself — a distinction beta one showed was not obvious, and which now prompts explicitly after you post.",
              },
              {
                title: "Search & filters",
                subtitle: "Finding the next one",
                text: "Filter by species, difficulty and conditions, with an adjustable search radius around wherever you are.",
              },
            ],
          },
          {
            type: "cards",
            label: "The social layer, built once the map held up",
            items: [
              {
                title: "Species ID",
                subtitle: "Claude API",
                text: "A photo suggests the most likely species, weighted by GPS location so the shortlist is drawn from what actually grows nearby. Runs server-side so the API key never reaches the app.",
              },
              {
                title: "Badges",
                subtitle: "Seven, criteria-based",
                text: "Off the Ground for a first ascent, Taxonomist for ten species, Twenty Trees Deep, Tree Hugger for thirty favourites, Ribbit Ribbit for forty reviews, Johnny Appleseed for fifty trees added, Part Squirrel for a hundred ascents.",
              },
              {
                title: "Profiles & life list",
                subtitle: "Your own record",
                text: "A public profile per climber, plus a running life list of every species climbed — the birdwatching convention applied to trees.",
              },
              {
                title: "Sharing",
                subtitle: "Built as a requirement",
                text: "Shareable profile cards rendered from your real stats, and links that open straight to the right tree — the direct output of the advisor session.",
              },
            ],
          },

          {
            type: "beat",
            kicker: "Where It Stands",
            heading:
              "Built, in the App Store pipeline, and now in its second beta.",
            text: "The map, tree pages, ascent logging, search, profiles, badges and the Treemium tier are all built and working end to end. What's still unproven is the part no amount of design can settle on its own — whether climbers who weren't part of the plan will fill the map in.",
          },
        ],
        // Bottom-of-page link back to the engineering write-up — the two
        // pages tell the same project from two different angles.
        link: "/projects/alltrees",
        linkLabel: "view this project from another perspective",
      },
      {
        // Own slug and write-up, separate from the Routesetting page
        // under Build — same photos, but framed as a design constraint
        // problem rather than the build/process story.
        title: "Route Design",
        description: "The movement design behind my climbing routes.",
        tags: ["Routesetting"],
        slug: "route-design",
        waveGroup: "routesetting",
        image: "/projects/routesetting/cover.jpg",
        heroImageFirst: true,
        body: [
          {
            type: "text",
            text: "I set boulder problems and routes at three gyms: Active Climbing in Athens, GA, the Brandeis Climbing Wall in Waltham, MA, and Central Rock Gym in Watertown, MA. Every route starts from the same limited set of holds and the same wall — the design problem is finding movement inside those constraints that reads clearly at its grade, feels good in the body, and doesn't leave an accidental easier way through.",
          },
          {
            type: "images",
            images: [
              "/projects/routesetting/route-1.jpg",
              "/projects/routesetting/route-2.jpg",
            ],
          },
        ],
        link: "/projects/routesetting",
        linkLabel: "view this project from another perspective",
      },
      {
        // Own slug and write-up, separate from the Pete the Snail page
        // under Play — focused on the character art itself rather than
        // the Unity mechanics. Same title as the Play entry (rather than
        // "Pete Assets") so both halves read as one project everywhere —
        // the card here, the sea's shared wave, and the panel list.
        title: "Pete the Snail",
        description: "The character art and sprites, painted in Krita.",
        image: "/projects/snail/pete-portrait.png",
        tags: ["Krita", "Character Design"],
        year: "2023",
        slug: "pete-assets",
        waveGroup: "pete-the-snail",
        heroImageFirst: true,
        body: [
          {
            type: "text",
            text: "Pete's idle animation, the ants he chases, and the sprite work behind both — all painted in Krita before any of it went into Unity.",
          },
          {
            type: "images",
            images: [
              "/projects/snail/pete-idle.gif",
              "/projects/snail/ant-sheet.png",
            ],
          },
        ],
        link: "/projects/pete-the-snail",
        linkLabel: "view this project from another perspective",
      },
      {
        title: "Interior Design",
        description:
          "Repainting my childhood bedroom and hand-painting a heron-and-sun mural directly onto the wall, freshman summer of college.",
        year: "2022",
        palette: ["#425348", "#ACA589", "#D6D2D2", "#4E2A0E", "#B27858"],
        // Vertical-story pass #2, same pattern as Voices Meet Minds:
        // heroImageFirst opens on the room itself (no text, down-arrow
        // cue from page.tsx), then every named section below is a
        // StoryBeat (kicker + one-line heading, optional short text) —
        // no more of the old small-caps `heading` + full paragraph
        // pairing, which is exactly the "mixing styles"/too-much-text
        // bug from the first VMM pass.
        heroImageFirst: true,
        body: [
          {
            type: "beat",
            kicker: "The Problem",
            heading: "A room I didn't want to come back to.",
            text: "This was my childhood bedroom — bright blue walls, mismatched furniture, a cluttered layout. The summer after my freshman year of college, I decided it needed a full reset.",
            image: "/projects/childhood-bedroom/before-room-wide.jpg",
            imageRatio: 1600 / 2133,
          },
          {
            type: "beat",
            kicker: "The Solution",
            heading:
              "A calmer palette, a hand-painted mural, and furniture that actually fits the room.",
          },
          {
            type: "pills",
            label: "Goals",
            items: ["<$100", "2 Months"],
          },
          {
            type: "beat",
            kicker: "The Palette",
            heading: "Calm and warm, replacing the bright blue.",
            text: "Sourced from Pinterest and Google before touching any paint.",
          },
          {
            type: "palette",
          },
          {
            type: "beat",
            kicker: "The Process",
            heading:
              "I projected my reference onto the wall to trace the linework before painting anything freehand.",
            text: "Two gallons of paint plus a handful of sample pots for the birds' detail colors — the whole budget.",
          },
          {
            type: "slideshow",
            images: [
              "/projects/childhood-bedroom/mural-wide-final.jpg",
              "/projects/childhood-bedroom/mural-close-final.jpg",
              "/projects/childhood-bedroom/green-wall-final.jpg",
            ],
          },
          {
            type: "beat",
            kicker: "The Furniture",
            heading:
              "Reoriented the layout for more space, and deconstructed the box spring — reinforced it and added hinged flaps for under-bed storage.",
            text: "White sheer curtains in, an old bookcase out. The bed's storage flaps run on spare wood planks and hinges, and the rest of the furniture is repurposed from other rooms rather than bought new.",
          },
          {
            type: "beat",
            kicker: "The Result",
            heading: "A calmer room I actually want to come back to.",
          },
          {
            type: "before-after",
            before: "/projects/childhood-bedroom/before-desk.jpg",
            after: "/projects/childhood-bedroom/after-reveal.jpg",
          },
        ],
        tags: ["Interior Design", "Mural", "Painting"],
        tagLabel: "Interior Design",
        // The staged reveal shot, not the in-progress mural — this is the
        // "finished result" image, so it's what should represent the
        // project both as the category-page thumbnail and (via
        // heroImageFirst) the opening hero.
        image: "/projects/childhood-bedroom/after-reveal.jpg",
        slug: "childhood-bedroom",
      },
    ],
  },
  {
    id: "play",
    label: "Play",
    blurb: "Game Dev & Motion",
    tagline: "I don't want you to think something — I want you to feel it.",
    projects: [
      {
        title: "Pete the Snail",
        description:
          "A Snake-inspired game where the trail behind you is slime, and the things you're chasing are ants. Currently paused.",
        tagLabel: "Game Design",
        waveGroup: "pete-the-snail",
        heroImageFirst: true,
        body: [
          {
            type: "text",
            text: "A Unity/C# game design, currently paused: a Snake-inspired twist where you play as a snail named Pete leaving a slime trail behind you. Encircle ants with the trail to collect them — the trail fades after a few seconds if you don't loop it around something first. The fuller vision was for your trail to grow longer as you collect bigger colonies, working toward destroying the ant hill.\n\nNo gameplay footage — I can't currently reinstall Unity on this machine to record it — but the core movement, slime-trail tracking, and ant-following mechanics were built and working.",
          },
          {
            type: "images",
            images: [
              "/projects/snail/pete-idle.gif",
              "/projects/snail/ant-sheet.png",
            ],
          },
        ],
        tags: ["Unity", "C#", "Game Design", "Krita"],
        year: "2023",
        slug: "pete-the-snail",
        image: "/projects/snail/pete-portrait.png",
        link: "/projects/pete-assets",
        linkLabel: "view this project from another perspective",
        codeSnippet: {
          label: "SnaleHandler.cs — slime trail tracking",
          code: `private Queue<(Vector3, float)> positionRecord = new Queue<(Vector3, float)>();
private LineRenderer slimeTrail;

private void Update() {
    float moveX = Input.GetAxis("Horizontal");
    float moveY = Input.GetAxis("Vertical");

    if (moveX != 0 || moveY != 0) {
        Move(moveX, moveY);
        peteAnimator.SetFloat("Speed", 1);

        // record where we've been, with a timestamp
        positionRecord.Enqueue((rb.position, Time.time));

        // let old trail points expire after slimeDuration seconds
        while (positionRecord.Count > 0 &&
               Time.time - positionRecord.Peek().Item2 > slimeDuration) {
            positionRecord.Dequeue();
        }

        UpdateLineRenderer();
    } else {
        peteAnimator.SetFloat("Speed", 0);
        UpdateLineRenderer();
    }
}

private void UpdateLineRenderer() {
    slimeTrail.positionCount = positionRecord.Count;
    int index = 0;
    foreach (var (position, timestamp) in positionRecord) {
        slimeTrail.SetPosition(index, position);
        index++;
    }
}`,
        },
        section: "Games",
      },
      {
        title: "Fire & Water",
        description:
          "A browser-based VR maze where fire boy and water girl are being hunted by something. I modeled, animated, and coded the chase myself.",
        heroImageFirst: true,
        body: [
          {
            type: "text",
            text: "Browser-based VR game built with A-Frame and the Ammo.js physics engine, created as a 3-person final project for a 3D animation course. The game spans three connected levels built by each team member; this is mine — a first-person maze of stone platforms surrounded by water where the player is pursued by physics-driven enemies, with reaching the wrong thing ending the game and reaching the right thing advancing it.\n\nFor my level, I modeled, rigged, and animated the fire boy and water girl characters (along with custom signage) myself, and wrote the game logic in JavaScript: a chase component that tracks the player's position each frame, moves enemies toward them, and triggers a game-over or level transition on contact.",
          },
          {
            type: "images",
            images: [
              "/projects/fire-and-water/doorway.jpg",
              "/projects/fire-and-water/fireboy.png",
              "/projects/fire-and-water/watergirl.png",
            ],
          },
        ],
        tags: ["A-Frame", "JavaScript", "Blender", "Physics"],
        tagLabel: "VR Game Design",
        link: "#",
        featured: true,
        image: "/projects/fire-and-water/cover.jpg",
        year: "2021",
        slug: "fire-and-water",
        section: "Games",
        codeSnippet: {
          label: "follow.js — chase & collision logic",
          code: `AFRAME.registerComponent('follow', {
  schema: {
    target: {type: 'selector'}, // entity to follow
    speed: {type: 'number'},    // speed to follow at
    url: {type: 'string'},      // url to go to when target is hit
    dist: {type: 'number', default: 5} // distance where following starts
  },

  init: function () {
    this.directionVec3 = new THREE.Vector3();
  },

  tick: function (time, timeDelta) {
    var directionVec3 = this.directionVec3;

    // Grab position vectors from the entities' three.js objects.
    var targetPosition = this.data.target.object3D.position;
    var currentPosition = this.el.object3D.position;

    // Direction the entity should head in, and the distance to it.
    directionVec3.copy(targetPosition).sub(currentPosition);
    var distance = directionVec3.length();

    // Close enough to the target: end the game / advance the level.
    if (distance < 0.5 && this.data.url) {
      window.location.href = this.data.url;
    } else if (distance > this.data.dist) {
      return;
    }

    // Normalize, then scale by speed and frame time so movement stays
    // consistent regardless of framerate.
    var factor = this.data.speed * (timeDelta / 1000);
    directionVec3.x = (directionVec3.x / distance) * factor;
    directionVec3.y = (directionVec3.y / distance) * factor;
    directionVec3.z = (directionVec3.z / distance) * factor;

    var p = this.el.object3D.position;
    this.el.object3D.position.set(p.x + directionVec3.x, p.y + directionVec3.y, p.z + directionVec3.z);
  }
});`,
        },
        reflection: {
          proudOf:
            "The concept. This was my first game, so I didn't want to bite off more than I could chew — but a simple game can still be hard to make interesting. Building it around fireboy and watergirl, well-known and loved characters, gave the mission an emotional hook and a context to explore basic physics and pursuit mechanics within.",
          learned:
            "The end-to-end process of game design: taking a concept from an idea to a working, playable system with real mechanics.",
          redo:
            "I'd clean up the maze's visual design. The first time through, the priority was getting core features — physics, chase AI, level transitions — working properly.",
        },
      },
      {
        title: "Contact",
        description:
          "A film with no original footage — every frame pulled from the Internet Archive and cut together around one question: what's real anymore?",
        details:
          "A found-footage piece assembled entirely from clips pulled off the Internet Archive and cut together in Adobe Premiere. Started in 2025 and kept getting re-edited into early 2026 as the throughline sharpened. The premise driving the edit: what's real anymore?",
        tags: ["Adobe Premiere", "Found Footage", "Internet Archive"],
        tagLabel: "Short Film",
        heroImageFirst: true,
        image: "/projects/contact/cover.jpg",
        video: "/projects/contact/contact.mp4",
        slug: "contact",
        year: "2026",
        section: "Videos",
      },
      {
        title: "Entrance",
        description:
          "There's something primal about how the body rejects the world. Short film — directed, written, shot, and acted by me.",
        details:
          "A short film I wrote, directed, and acted in, shot on a proper camera and tripod rented from the library. Edited in Adobe Premiere with Adobe Audition for the audio pass. The idea driving it: there's something primal about how the body rejects the world.",
        tags: [
          "Directing",
          "Acting",
          "Screenwriting",
          "Videography",
          "Adobe Premiere",
          "Adobe Audition",
        ],
        tagLabel: "Short Film",
        heroImageFirst: true,
        image: "/projects/entrance/cover.jpg",
        video: "/projects/entrance/entrance.mp4",
        slug: "entrance",
        year: "2025",
        section: "Videos",
      },
      {
        title: "Blackjack",
        description:
          "A short Blender character animation experimenting with lighting, rigging, and body language.",
        details:
          "A short character animation piece made almost entirely in Blender, for a 3D animation class.",
        tags: ["3D Animation", "Blender"],
        tagLabel: "3D Animation",
        heroImageFirst: true,
        image: "/projects/blackjack/cover.jpg",
        video: "/projects/blackjack/blackjack.mp4",
        section: "Videos",
        slug: "blackjack",
        year: "2021",
        reflection: {
          proudOf:
            "The tone of the piece — the lighting, and the personality that comes through in the camera angles and body language.",
          learned:
            "A lot about rigging, keyframing, and the full start-to-end process of making a 3D animation.",
          redo:
            "I'd make sure all my assets loaded properly — the ladybug's skin kept disappearing on me — and learn more about rigging to get rid of the skin spiking.",
        },
      },
    ],
  },
  {
    id: "discover",
    label: "Discover",
    blurb: "Research",
    projects: [
      {
        title: "Ebbinghaus-Titchener Illusion in Grey Parrots",
        description:
          "Do parrots see the same optical illusions we do? Co-authored research testing that question with Dr. Irene Pepperberg's lab — currently in revision.",
        details:
          "A study with The Alex Foundation, led by Dr. Irene Pepperberg, testing whether four Grey parrots (Griffin, Athena, Pepper, and Franco) perceive the Ebbinghaus-Titchener illusion — the classic effect where a central circle looks smaller when surrounded by larger circles, and larger when surrounded by smaller ones. Rather than asking the birds to describe what they saw, the design (adapted from a primate study by Hanus et al., 2023) let them choose between two equal-sized juice cups, each on a tile surrounded by differently sized flanker circles, on the assumption that a bird experiencing the illusion would reliably pick the cup that looked larger.\n\nThe paper is co-authored with Anaya Zachery, Francesca M. Cornero, Leigh Ann Hartsfield, Charlotte Mulligan, and Irene M. Pepperberg. Cornero was primarily responsible for the statistical analysis; I reviewed the analysis code and was present for some of the experimental trials.\n\nThe results were largely null: none of the four birds showed a statistically reliable preference consistent with the illusion. Two showed no significant pattern at all; the other two showed a preference that traced back almost entirely to a strong left- or right-side bias rather than to the illusion itself. The discussion works through several explanations — prior studies that had deliberately deceived these same birds may have taught them to distrust cups they couldn't fully inspect, they may have run informal \"contingency tests\" early on and learned both cups held equal juice, or the physical act of approaching and touching a tile may have shifted their viewing angle enough to break the illusion outright. A revised protocol is planned to test that last hypothesis directly.",
        tags: ["Animal Cognition", "Psychology Research", "Data Collection"],
        tagLabel: "Cognition Research",
        year: "2025",
        heroImageFirst: true,
        slug: "ebbinghaus-illusion-grey-parrots",
        image: "/projects/ebbinghaus-illusion-grey-parrots/parrot-cover-v2.jpg",
      },
      {
        title: "Contrafreeloading in Grey Parrots",
        description:
          "Would you rather work for your food, or eat the same thing for free? Grey parrots have opinions — I helped keep this study running at The Alex Foundation.",
        tags: ["Animal Cognition", "Data Collection", "Psychology Research"],
        tagLabel: "Cognition Research",
        year: "2025",
        heroImageFirst: true,
        body: [
          {
            type: "text",
            text: "A study at The Alex Foundation (Dr. Irene Pepperberg's lab) led by PhD student Alana Carroll, looking at contrafreeloading in Grey parrots — the well-documented phenomenon, seen across many species, where animals given a choice will sometimes prefer to \"work\" for food (e.g., extracting it from something) over eating identical food that's freely available. I helped keep data collection running for the study while Alana was away.\n\nBirds (Athena, Franco, Griffin, Lucci, and Pepper) chose between food presented loose on a tray versus food wrapped in scrunched-up paper they had to work to open, across three condition types — \"super,\" \"classic,\" and \"calculated.\" A separate round of food-preference testing (pairwise choices between items like almonds, cashews, pecans, crackers, cereal, and safflower seed) was run per bird beforehand, so each parrot's trials used food it was already known to prefer.\n\nThe design builds on two prior contrafreeloading studies from the same lab: Smith, Bastos, Taylor & Pepperberg (2022, Scientific Reports), comparing kea to Grey parrots, and Carroll & Pepperberg (2024/2025, Journal of Comparative Psychology), comparing umbrella cockatoos to Grey parrots. A paper specific to this round of Grey parrot data hasn't come out yet, as far as I can find — I'm trying to track down its status.",
          },
          {
            type: "full-image",
            image: "/projects/contrafreeloading-parrots/contrafreeloading-by-condition.jpg",
          },
        ],
        slug: "contrafreeloading-parrots",
        link: "https://pubmed.ncbi.nlm.nih.gov/39250240/",
        linkLabel: "View related publication",
        image: "/projects/contrafreeloading-parrots/overall-contrafreeloading.jpg",
      },
      {
        title: "Cognitive Flexibility Research",
        description:
          "An EEG eye-tracking internship studying how the brain shifts gears — co-authored work submitted to the Cognitive Neuroscience Society.",
        details:
          "An internship at the Clinical and Cognitive Neuroscience Lab at the University of Georgia, run by Dr. McDowell and Dr. Clemenz, working under grad student mentor Beryl Huang on her cognitive flexibility research in young adults. The lab's broader work spans schizophrenia, sensory processing, and aging, using MRI, fMRI, EEG, and eye-tracking.\n\nMy role centered on the technical side of an EEG eye-tracking paradigm: setting up and troubleshooting the hardware, running timing tests, calibrating the eye tracker, and helping design the study's preregistration. I also picked up R to build a script that converts raw eye-movement data (recorded per participant as a large Excel export) into clean PDF reports of eye position and velocity over time — the processing pipeline the study now uses for every participant. Later on I was trained to score EEG data by hand as well, ahead of full-scale data collection.\n\nThe project — an interactive ocular motor set-shifting task designed to evoke distinct electrophysiological markers across stages of cognitive flexibility — was submitted to the Cognitive Neuroscience Society's 2023 meeting with me as a co-author.\n\nOutside the core project, I sat in on other work in the lab (a clozapine drug trial using EEG and eye-tracking, an fMRI study of brain structure in psychosis) and gave weekly presentations to my mentor on assigned and self-chosen readings — a big part of how I found the areas of psychology (autism, executive function, theory of mind) I'm most interested in continuing to explore.",
        tags: ["R", "EEG", "Eye-Tracking", "Psychology Research", "Data Analysis"],
        tagLabel: "Neuroscience Research",
        year: "2023",
        heroImageFirst: true,
        slug: "cognitive-flexibility-research",
        image: "/projects/cognitive-flexibility-research/eye-movement-plot.png",
        reflection: {
          proudOf:
            "My ability to still enjoy myself when troubleshooting was frustrating or particularly long, and my ability to interact naturally with participants. I know these skills will not always come easily to me, but I am proud to find success when it happens.",
          learned:
            "Many hard and soft skills — interacting with patients, troubleshooting the tools and methods of an experiment, how to code in R, how to set up, run, and clean data of an EEG, and the thought process behind creating research questions and designing studies.",
        },
      },
      {
        title: "Bird Call Classification Research",
        description:
          "Do chickadees change their calls when a hawk is nearby? Cornell Lab of Ornithology research I helped turn into a co-authored paper, published in Ecology.",
        featured: true,
        tags: ["R", "Data Cleaning", "Cluster Analysis", "Machine Learning", "Bioacoustics"],
        tagLabel: "Bioacoustics Research",
        year: "2024",
        heroImageFirst: true,
        body: [
          {
            type: "text",
            text: "A remote research position at the Cornell Lab of Ornithology, working under Connor Wood and Michael Pardo at the K. Lisa Yang Center for Conservation Bioacoustics on a large bird call database. I used R to clean and optimize the dataset, improving how efficiently it could be accessed for later machine learning work, and built an unsupervised classification cluster analysis using feature embeddings in R to categorize chickadee vocalizations — cutting down the human hours needed to process large amounts of audio data. I also wrote R code to identify the ratios of different chickadee call types within complex datasets, helping distinguish call patterns, and manually identified call types from large audio datasets by hand to help verify and validate the automated analysis tools.\n\nMuch of the pipeline work involved filtering huge detection sets down to something usable: matching site/date combinations against a curated set of goshawk-call mornings, applying BirdNET confidence thresholds (pr(tp) > 0.90/0.95/0.975/0.99) to control for false positives, restricting to a consistent early-morning window to avoid conflating dawn and dusk vocal activity, and setting minimum call-count cutoffs per site/day. From there I generated before/after interval ratio comparisons — like the ones below — to look at how chickadee call rates shifted around a goshawk detection.\n\nThat work became a co-authored paper, \"Passive acoustic monitoring reveals surprising patterns of avian community antipredator behavior at a regional scale,\" accepted into Ecology on January 29, 2026 and since published.",
          },
          {
            type: "images",
            images: [
              "/projects/bird-call-research/kmeans-subset.png",
              "/projects/bird-call-research/pcoa-plot.png",
              "/projects/bird-call-research/goshawk-interval-ratios.png",
              "/projects/bird-call-research/goshawk-average-ratios.png",
              "/projects/bird-call-research/body-size-comparison.png",
            ],
          },
        ],
        slug: "bird-call-research",
        link: "https://doi.org/10.1002/ecy.70362",
        linkLabel: "View publication",
        image: "/projects/bird-call-research/kmeans-full.png",
      },
    ],
  },
  {
    id: "write",
    label: "Write",
    blurb: "Creative Writing",
    tagline: "To want to be an authentic person in an increasingly fabricated world.",
    projects: [
      {
        title: "In which illness is a dull red thing with feathers",
        description:
          "A prize-winning poem about illness, published in Laurel Moon.",
        tags: ["Poetry"],
        image: "/write/dull-red-thing/cover.jpg",
        link: "https://www.laurelmoonmag.com/riley-byers-in-which-illness-is-a-dull-thing-with-feathers",
        linkLabel: "Read on Laurel Moon",
        tagLabel: "Poetry",
        featured: true,
        year: "2023",
      },
      {
        title: "Achieving Godhood",
        description: "A prose piece published in The Cairn.",
        tags: ["Prose"],
        image: "/write/achieving-godhood/cover.jpg",
        tagLabel: "Prose",
        year: "2024",
        link: "https://thecairnstonehill.org/achieving-godhood/",
        linkLabel: "Read on The Cairn",
      },
      {
        title: "A Gull Calls Me",
        description:
          "A poem I published anonymously in the Touch Grass anthology from Antelope Hill Publishing.",
        tags: ["Poetry"],
        image: "/write/a-gull-calls-me/cover.jpg",
        tagLabel: "Poetry",
        year: "2023",
        link: "https://antelopehillpublishing.com/product/touch-grass-antelope-hill-writing-competition-2023/",
        linkLabel: "View the anthology",
      },
      {
        title: "I am unsure of the validity of my claims",
        description:
          "A chapbook that interrogates the meaning of truth — seeking a publisher.",
        tags: ["Poetry", "Chapbook"],
        tagLabel: "Poetry Chapbook",
        heroImageFirst: true,
        slug: "unsure-of-the-validity",
        image: "/write/chapbook/cover.jpg",
      },
      {
        title: "Sometimes It's All Consuming",
        description:
          "A chapbook about parts of the mind that don't stay quiet — seeking a publisher.",
        tags: ["Poetry", "Chapbook"],
        tagLabel: "Poetry Chapbook",
        heroImageFirst: true,
        image: "/write/sometimes-consuming/cover.jpg",
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

// Turns a title into a URL-safe slug — used so every project gets a
// dedicated page, even ones that were never given an explicit `slug`.
function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Flattened list of every project, with its category attached and a slug
// filled in (explicit or derived from the title) — used to generate
// /projects/<slug> pages for every project, and to look one up.
export const slugProjects = categories.flatMap((c) =>
  c.projects.map((p) => ({
    ...p,
    slug: p.slug ?? slugify(p.title),
    categoryId: c.id,
    categoryLabel: c.label,
  }))
);

// Rough "how much is actually here" score — used below to pick the
// fuller entry on the rare case a slug is still shared across two
// category entries (most cross-discipline projects now get their own
// slug and write-up instead — see AllTrees, Pete the Snail (pete-assets),
// and Route Design under Design — but this stays as a safety net for any
// that don't).
function richness(p: Project) {
  return (
    (p.year ? 1 : 0) +
    (p.image ? 1 : 0) +
    (p.details ? 1 : 0) +
    (p.gallery && p.gallery.length > 0 ? 1 : 0) +
    (p.video ? 1 : 0) +
    (p.codeSnippet ? 1 : 0) +
    (p.reflection ? 1 : 0)
  );
}

// One entry per slug — on the rare case two entries still share one,
// the fullest wins. Used by both getProjectBySlug and
// chronologicalProjects below.
const richestBySlug = (() => {
  const bySlug = new Map<string, (typeof slugProjects)[number]>();
  for (const p of slugProjects) {
    const existing = bySlug.get(p.slug);
    if (!existing || richness(p) > richness(existing)) {
      bySlug.set(p.slug, p);
    }
  }
  return bySlug;
})();

export function getProjectBySlug(slug: string) {
  return richestBySlug.get(slug);
}

// Every project, once each (see richestBySlug above), sorted
// newest-first by year. A handful of projects don't carry a year at all
// (ongoing work like this site itself, or writing still awaiting
// publication) — those sort to the end rather than guessing a date.
export const chronologicalProjects = (() => {
  const deduped = Array.from(richestBySlug.values());
  return deduped.sort((a, b) => {
    const ay = a.year ? parseInt(a.year, 10) : null;
    const by = b.year ? parseInt(b.year, 10) : null;
    if (ay === null && by === null) return 0;
    if (ay === null) return 1;
    if (by === null) return -1;
    return by - ay;
  });
})();

// Every project card links to its own dedicated page — whatever info
// exists (description, link, gallery) is shown there, even if that's
// just the description.
export function projectHref(project: Project) {
  return `/projects/${project.slug ?? slugify(project.title)}`;
}

export const profile = {
  name: "Riley Byers",
  tagline: "I build software, design experiences, study behavior, and tell stories.",
  intro:
    "I'm interested in the psychology behind things—the logic of characters, people, and decisions—and in using that understanding to help people. I'm drawn towards complexity, ambiguity, and intersecting disciplines. Currently, I'm inspired by multimodal sensing, rock climbing, affective computing, Susan Sontag, European starlings, my dreams, and my friend Jingyi.",
  // Shown next to "Selected work" — edit to whatever range is accurate.
  workYears: "2023 – 2026",
  email: "rileyabyers@gmail.com",
  cvHref: "/cv.pdf",
  photoSrc: "/hero-photo.jpg",
  aboutPhotoSrc: "/about-photo.jpg",
  // Second image the About page's photo crossfades to once the "Am
  // seeking" text scrolls into view — Riley's own pick from the batch of
  // photos dropped into public/.
  aboutPhotoSrc2: "/IMG_1382.JPG",
  socials: [
    { label: "GitHub", href: "https://github.com/rileyb3" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/riley-byers-45ab10191/" },
  ],
};
