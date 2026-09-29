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
    // One full-bleed row of same-shaped images, each big enough to read.
    // For portrait posts and mockups. See ImageRow.tsx.
    | {
        type: "image-row";
        images: string[];
        ratio?: number;
      }
    // A closing index of work that didn't earn its own section, full
    // bleed and captionless. See SettingGallery.tsx.
    | {
        type: "gallery";
        label?: string;
        images: string[];
      }
    // The same move under different conditions, side by side and
    // looping, with a shared replay so they can be read against each
    // other. See MoveComparison.tsx.
    | {
        type: "move-comparison";
        label?: string;
        clips: {
          src: string;
          poster?: string;
          variable: string;
          note?: string;
          // Where this setup sits on the precision/difficulty scale,
          // 1 = least demanding. Rendered as a dot meter so the four can
          // be ranked at a glance without reordering the row.
          rank?: number;
        }[];
      }
    // One area of a redesign as a matched pair — what was wrong, then
    // what replaced it, each with its evidence at full width underneath.
    // See ProblemSolution.tsx.
    | {
        type: "problem-solution";
        label: string;
        problem: {
          text: string;
          images: { src: string; ratio?: number; scrollHeight?: number }[];
        };
        solution: {
          text: string;
          images: { src: string; ratio?: number; scrollHeight?: number }[];
        };
      }
    // A wall photo with one route traced over it, the line drawing itself
    // bottom-to-top on scroll. See RouteTrace.tsx. `path` is SVG path data
    // in `viewBox` coordinates, ordered from the first hold upward — a
    // wall of holds is unreadable to anyone who doesn't climb, so this is
    // how a set gets pointed at.
    | {
        type: "route-trace";
        image: string;
        alt: string;
        path: string;
        viewBox: string;
        caption?: string;
      }
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
        // Make the subtitle the bold heading and demote the title to an
        // italic line beneath it. For sets where the category is what you
        // scan by ("Information architecture") and the finding is detail.
        leadWith?: "subtitle";
        items: { title: string; subtitle?: string; text: string }[];
      }
  >;
  // A purpose-built image for the discipline-page cards, when the hero
  // image doesn't survive a wide crop. AllTrees' hero is a square app
  // icon: correct at the top of its own page, but in a 2:1 card it is
  // either a magnified fragment (object-cover) or a small square marooned
  // in dead space (object-contain). This is a composed shot instead, so
  // the card can go back to filling its frame.
  cardImage?: string;
  // When true, the project's cover `image` renders full-bleed ABOVE the
  // title/tags/meta block instead of below it — "one big, simple picture
  // first, then scroll for the quick description" per angelechendesigns
  // .com/bink's opening beat. Opt-in per project so every other page
  // keeps its current title-first layout.
  heroImageFirst?: boolean;
  // How the opening image is presented. "full" (default) is the
  // full-bleed near-full-screen crop. "split" contains the image beside
  // the title instead — for covers whose subject is a fixed size (an app
  // icon, a character, a chart), where the full-bleed treatment both
  // crops the subject and inflates it. Ignored when `video` is set.
  // "showcase" puts the title block on top and the image beneath it at
  // its natural shape, wide — for composed shots (a phone collage) that
  // the split layout's half-width column would shrink to a thumbnail.
  heroLayout?: "full" | "split" | "showcase";
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
          "Think Mountain Project, but for trees. A community map where climbers discover, log, and review climbable trees — currently in second-round beta.",
        tagLabel: "iOS Build",
        featured: true,
        waveGroup: "alltrees",
        // Vertical-story treatment, same pattern as Voices Meet Minds and
        // Interior Design: heroImageFirst opens full-bleed on the app icon
        // (a single clean graphic mark, same role the finished mascot/room
        // photo played on those pages), then every named section below is
        // a StoryBeat. Screenshots throughout are real app screens, not
        // mockups — some carry obvious placeholder/test data (e.g. "(test)
        // :0" as a tree name) since this is still in beta.
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
            kicker: "Sharing",
            heading:
              "Any climb, tree, or badge can become a card and go straight to an Instagram Story.",
            text: "The cards render from live data on-device, and a companion site at alltrees.app carries links that open straight to the right tree in-app — so growth can come from climbers showing the app to other climbers.",
          },
          {
            type: "beat",
            kicker: "The Result",
            heading:
              "Now in second-round beta — the map, tree pages, ascent logging, search, profiles, and sharing are all built and live.",
            text: "First-round beta feedback already shaped several fixes; second-round beta is running now on iOS, with an Android build going out to testers.",
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
        heroLayout: "showcase",
        // The composed three-phone shot opens the page and is also the
        // card cover, so the project reads the same everywhere.
        cardImage: "/projects/alltrees/alltrees-card.jpg",
        image: "/projects/alltrees/alltrees-card.jpg",
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
          // August's lead wall is the page's cover image now, so it only
          // appears once — up top — rather than again down here.
          {
            type: "images",
            images: ["/projects/routesetting/september-boulder.jpg"],
          },
          {
            type: "route-trace",
            image: "/projects/routesetting/traced-route.jpg",
            alt: "A lead wall with one of my routes traced from the first hold to the anchor",
            viewBox: "0 0 1000 1333",
            path: "M 526 1272 L 517 1242 L 516 1211 L 516 1181 L 505 1150 L 491 1120 L 480 1059 L 472 1028 L 470 998 L 467 967 L 465 937 L 466 906 L 471 876 L 480 846 L 489 815 L 501 785 L 518 754 L 536 708 L 547 678 L 552 647 L 559 617 L 563 587 L 567 556 L 570 526 L 573 495 L 575 465 L 576 434 L 576 404 L 576 373 L 577 343 L 574 312 L 567 282 L 559 251 L 550 221 L 538 190 L 531 160 L 528 129 L 526 99 L 524 69 L 524 38 L 524 8",
          },
          // The setting footage lives down here as a body block rather than
          // as the page's top-level `video`. As a hero it rendered with
          // object-cover inside a max-h-[88vh] frame, which cropped roughly
          // half the frame away; the body block is full-bleed but uncropped.
          {
            type: "video",
            src: "/projects/routesetting/setting.mp4",
            poster: "/projects/routesetting/cover.jpg",
          },
        ],
        tags: ["Routesetting"],
        image: "/projects/routesetting/august-lead-wall.jpg",
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
          { src: "/art/henna/shoulder-climbing.jpg" },
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
        // Sequel to the VMM branding page below, which ends on "Next up:
        // a refresh of VMM's website." Separate project rather than a
        // section there: different problem, different research.
        //
        // Everything here is Riley's own account of the work or is
        // verifiable from the old and new sites. An earlier scaffold of
        // this page invented a five-phase Discover/Define/Design/Build/
        // Launch methodology with stakeholder interviews and grayscale
        // wireframes — none of which happened — and it has been removed.
        title: "Voices Meet Minds Website Redesign",
        description:
          "Restructuring a mental health nonprofit's site around what a first-time visitor actually needs — mission first, stories second, and a way in that isn't nine equal buttons.",
        tagLabel: "UI/UX",
        year: "2026",
        slug: "vmm-website",
        featured: true,
        heroImageFirst: true,
        image: "/projects/vmm-website/home-hero.jpg",
        tags: ["UI/UX", "Information Architecture", "Content Strategy", "Wix"],
        meta: [
          { label: "Timeline", values: ["September 2026", "2 weeks"] },
          { label: "Role", values: ["Solo designer"] },
          { label: "Tools", values: ["Wix"] },
        ],
        body: [
          {
            type: "text",
            text: "Voices Meet Minds is a mental health nonprofit built on storytelling. The writing is the organization's whole asset; the site around it was burying it. I redesigned it as a board member rather than an outside contractor, which meant taking my own restructure back to the board for approval.",
          },
          {
            type: "cards",
            label: "What was wrong",
            leadWith: "subtitle",
            items: [
              {
                title: "Nine flat nav items",
                subtitle: "Information architecture",
                text: "Nine, all equal weight, no hierarchy — and duplicated again in a hamburger above.",
              },
              {
                title: "Three story sections that read as one",
                subtitle: "Content model",
                text: "Three different things, presented identically — back-to-back card rows under matching \"View Stories\" buttons.",
              },
              {
                title: "No orientation before the hard part",
                subtitle: "Homepage",
                text: "The mission paragraph sat near the bottom. Personal writing came first, with nothing above it saying who VMM is.",
              },
              {
                title: "Donate buried in the row",
                subtitle: "Conversion",
                text: "A button among eight, styled like the rest.",
              },
            ],
          },

          {
            type: "problem-solution",
            label: "Navigation",
            problem: {
              text: "Nine destinations, all equal weight — plus a hamburger repeating them.",
              images: [{ src: "/projects/vmm-website/before-menu.jpg", ratio: 1800 / 305 }],
            },
            solution: {
              text: "Four, with the writing categories nested under Stories. Donate gets its own button.",
              images: [
                { src: "/projects/vmm-website/after-menu.jpg", ratio: 1800 / 122 },
                { src: "/projects/vmm-website/nav-structure.jpg", ratio: 672 / 1076 },
              ],
            },
          },

          {
            type: "problem-solution",
            label: "The Homepage",
            problem: {
              text: "A logo, and nothing saying what this is.",
              images: [{ src: "/projects/vmm-website/before-home.jpg", ratio: 1800 / 1016 }],
            },
            solution: {
              text: "What VMM is, what it stands for, and one way in — then the three things you can actually do, then the mission.",
              images: [
                { src: "/projects/vmm-website/home-hero.jpg", ratio: 1800 / 890 },
                { src: "/projects/vmm-website/home-lets-talk.jpg", ratio: 1800 / 835 },
                { src: "/projects/vmm-website/home-who-we-are.jpg", ratio: 1800 / 826 },
              ],
            },
          },

          {
            type: "problem-solution",
            label: "Stories",
            problem: {
              text: "Three different things, stacked back to back under matching \"View Stories\" buttons.",
              images: [
                {
                  src: "/projects/vmm-website/before-stories-scroll.jpg",
                  ratio: 1800 / 1841,
                  scrollHeight: 560,
                },
              ],
            },
            solution: {
              text: "One page. Each featured read carries its category, and Browse By Category explains each in a line — the sentence the old nav never had.",
              images: [
                {
                  // The three separate captures of the new Stories page
                  // stitched back into the one continuous page they came
                  // from, so the after can be scrolled exactly like the
                  // before it is answering.
                  src: "/projects/vmm-website/after-stories-scroll.jpg",
                  ratio: 1800 / 1984,
                  scrollHeight: 560,
                },
              ],
            },
          },

          {
            type: "beat",
            kicker: "Where It Stands",
            heading: "Designed, approved, and live on Wix.",
            text: "Rebuilt in place, so nothing about it depends on me being around to maintain it.",
          },
        ],
        link: "/projects/voices-meet-minds",
        linkLabel: "see other VMM branding work",
      },
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
              "VMM's existing mark is a butterfly. A caterpillar is the same creature, one stage earlier — staying on brand.",
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
            image: "/projects/voices-meet-minds/mascot.jpg",
            imageRatio: 678 / 640,
          },

          // ---- In use -------------------------------------------------
          // What the org did with him. Captions and claims are limited to
          // what is legible in the images themselves.
          {
            type: "beat",
            kicker: "In Use",
            heading:
              "He's introduced in the August 2026 issue of Metamorphosis, VMM's newsletter.",
          },
          {
            type: "full-image",
            image: "/projects/voices-meet-minds/mockups/mockup-newsletter.jpg",
          },
          {
            type: "beat",
            kicker: "The Naming Call",
            heading:
              "VMM's posts introduce him to the community and ask for a name.",
          },
          {
            type: "image-row",
            ratio: 1080 / 1350,
            images: [
              "/projects/voices-meet-minds/mockups/mockup-naming-camp.jpg",
              "/projects/voices-meet-minds/mockups/mockup-naming-paint.jpg",
            ],
          },
          {
            type: "beat",
            kicker: "What's Next",
            heading: "A refresh of VMM's website.",
          },
        ],
        tags: ["Branding", "Character Design", "Mascot Design"],
        // Return leg of the VMM pair. Both sit under Design, so the link
        // renderer omits the discipline pill (it would read "Go to
        // Design" while you're already on a Design page).
        link: "/projects/vmm-website",
        linkLabel: "see other VMM branding work",
        // The cover is one of VMM's own mascot-announcement posts (the
        // starry-night polaroid), opened beside the title via the split
        // hero. card.jpg, the padded 16:9 character art that used to be
        // the cover, is now unused — the finished character still appears
        // in "The Result" below. The green colourway is the final pick;
        // the blue one (mascot-final-blue.png, card-final-blue.jpg) was
        // tried and dropped, and those files are unused too.
        image: "/projects/voices-meet-minds/mockups/mockup-naming-night.jpg",
        // The cover is a 4:5 poster, which object-cover would crop to a
        // meaningless band in a wide card. This is the same poster whole,
        // on a blurred copy of itself.
        cardImage: "/projects/voices-meet-minds/mockups/card-mockup.jpg",
        slug: "voices-meet-minds",
        heroLayout: "split",
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
        heroLayout: "showcase",
        cardImage: "/projects/alltrees/alltrees-card.jpg",
        // Same waveGroup as the Build entry — the sea still recognizes
        // these as one project and draws a two-color wave for it, even
        // though each links to its own page now.
        waveGroup: "alltrees",
        featured: true,
        heroImageFirst: true,
        image: "/projects/alltrees/alltrees-card.jpg",
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
            text: "AllTrees is a community map for tree climbers — find a tree, log an ascent, review it, and see what other climbers already knew about it. This page is the design side: the app itself, how the scope got set, and what testing changed. The engineering write-up lives on the Build page.",
          },

          // ---- The app, first ---------------------------------------
          // The product leads. Two phone-mockup strips composed from real
          // captures, so the page opens on the thing rather than on the
          // process that produced it.
          { type: "heading", text: "Find a tree, and know it" },
          {
            type: "full-image",
            image: "/projects/alltrees-design/tour-find.jpg",
            bleed: true,
          },
          { type: "heading", text: "Keep a record, and share it" },
          {
            type: "full-image",
            image: "/projects/alltrees-design/tour-keep.jpg",
            bleed: true,
          },

          // ---- Timeline ----------------------------------------------
          // Six months at half-month resolution: 12 columns, two per
          // month, so tasks can overlap phase boundaries the way they
          // really did rather than snapping to tidy month blocks.
          {
            type: "timeline",
            kicker: "Project Timeline",
            heading:
              "Six months, from a voice note after a climbing competition to a second beta.",
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

          // ---- Scope and stack ---------------------------------------
          {
            type: "cards",
            label: "What the first session settled",
            items: [
              {
                title: "The map comes first",
                subtitle: "Non-negotiable",
                text: "Every other feature depends on users dropping pins, so nothing was allowed to compete with it for build time.",
              },
              {
                title: "Then a page per tree",
                subtitle: "Second priority",
                text: "A pin needs somewhere to land — rating, difficulty, conditions, who climbed it first.",
              },
              {
                title: "Then people, if it isn't too hard",
                subtitle: "Conditional",
                text: "Profiles and social were deferred behind the first two. The map and tree pages came together in time, so they got built.",
              },
            ],
          },
          {
            type: "cards",
            label: "Four software decisions",
            leadWith: "subtitle",
            items: [
              {
                title: "Mapbox, over Google Maps & Apple MapKit",
                subtitle: "Map",
                text: "The map is the product, so it had to look like AllTrees. Mapbox restyles vector tiles layer by layer, which got the map green and tree-forward with no custom assets.",
              },
              {
                title: "Supabase, over Firebase",
                subtitle: "User credentials",
                text: "Accounts, sign-in and the tree database in one service. \"Trees near me\" is a geographic query Postgres does natively, and row-level security keeps climbers to their own entries.",
              },
              {
                title: "Figma",
                subtitle: "Design",
                text: "Pins, leaf icons and badges had to be drawn before they could be built. Screens iterate in minutes there and in hours in code.",
              },
              {
                title: "RevenueCat",
                subtitle: "Subscriptions",
                text: "Receipts, restores, trials and cancellations are a long tail unrelated to tree climbing. RevenueCat reduces it to one entitlement flag.",
              },
            ],
          },

          // ---- Treemium ----------------------------------------------
          {
            type: "beat",
            kicker: "Treemium",
            heading:
              "Every core feature stays free. What you pay for is the part that's fun to show people.",
            text: "I'd planned a Kickstarter. Advice from my brother, COO of an e-commerce services company, moved it to a premium tier instead — and made sharing a priority. The constraint was that nothing load-bearing could sit behind the paywall, so Treemium is built from things that are desirable without being necessary.",
          },
          {
            type: "cards",
            label: "Three paid features, chosen for different reasons",
            items: [
              {
                title: "Custom pins",
                subtitle: "Retention",
                text: "Nine leaf shapes, one per botanical family, each unlocked by climbing a tree from that family — a reason to keep climbing, not a cosmetic you buy once.",
              },
              {
                title: "The climber archetype",
                subtitle: "Desire",
                text: "Six behavioural axes scored from your ascents resolve into one of ten animals, from the Sloth to the Leopard.",
              },
              {
                title: "For You",
                subtitle: "Utility",
                text: "Recommendations weighted by where you climb and what you've climbed. The one paid feature that's useful rather than expressive.",
              },
            ],
          },
          {
            type: "text-with-image",
            text: "The six axes as a radar chart, so the archetype is shown being derived rather than asserted. Mine resolves to The Treecreeper — high diversity, high dedication, low risk.",
            image: "/projects/alltrees-design/stats-radar.jpg",
          },

          // ---- Testing -----------------------------------------------
          {
            type: "beat",
            kicker: "Beta One",
            heading:
              "Four testers, split on purpose: two climbers who helped scope it, two UX designers who hadn't.",
            text: "Half had the full context of what the app was meant to become; half met it as a new interface. Feedback came as written notes and calls, and the useful part was unglamorous — specific, fixable problems, each of which shipped a change.",
          },
          {
            type: "cards",
            label: "What testing changed",
            items: [
              {
                title: "Form flow",
                subtitle: "Input",
                text: "Long text entry, like writing a review, needed a way to put the keyboard away. It got one.",
              },
              {
                title: "Action clarity",
                subtitle: "Comprehension",
                text: "Adding a tree and logging the first ascent read as one step. A prompt after posting now separates them.",
              },
              {
                title: "Broken controls",
                subtitle: "Bugs",
                text: "Small things that looked interactive and weren't, like the edit-profile-photo control. Fixed.",
              },
              {
                title: "Legibility",
                subtitle: "Visual",
                text: "The tab bar. Shown below — it's the fix that's easiest to see.",
              },
            ],
          },
          // Same crop from the same screen on the same device, so the two
          // halves line up exactly under the slider — the only thing that
          // moves is the thing that actually changed.
          {
            type: "beat",
            kicker: "Example fix",
            heading: "Tab bar contrast",
            text: "Dark green on green since the first build, and I'd stopped seeing it — it was legible to me because I already knew what the icons said. Icons and labels went white; the active tab keeps the bright green. Drag the slider.",
          },
          {
            type: "before-after",
            before: "/projects/alltrees-design/tabbar-before.jpg",
            after: "/projects/alltrees-design/tabbar-after.jpg",
          },

          // ---- The login redesign ------------------------------------
          {
            type: "beat",
            kicker: "The Login Screen",
            heading: "One tap back in, with a \"last used\" indicator.",
            text: "Before: three full-width buttons, guest access reduced to a small underlined link, and nothing to say which method you used last time. After: four equal paths, the last one used flagged, and a guest mode so the map can be browsed before committing to an account.",
          },
          // One composed image, both screens in identical frames — the
          // comparison is the layout, not the recording chrome around it.
          {
            type: "full-image",
            image: "/projects/alltrees-design/login-compare.jpg",
            bleed: true,
          },

          // ---- Sharing ------------------------------------------------
          {
            type: "text-with-image",
            text: "Sharing was designed as a requirement, not an add-on. The community mad-lib — \"Where ___ meets ___\" — turns the tagline into something climbers fill in themselves, with the blanks boxed so whatever gets typed reads as their words, never the brand's. Every card is a different, screenshot-ready ad.",
            image: "/projects/alltrees-design/madlib-post.jpg",
          },

          // ---- Beta two / where it stands ----------------------------
          {
            type: "beat",
            kicker: "Beta Two — Running Now",
            heading:
              "The second round isn't testing whether it works. It's testing whether the map fills up.",
            text: "25 testers, and 100 trees on the map by the end of it — a number instead of a feeling. The measure that matters is whether pins appear in places I've never been, which is the only evidence this works as a community map and not as my personal tree diary.",
          },
          {
            type: "text-with-image",
            text: "Built on iOS with an Android build going to testers, plus a landing site at alltrees.app that carries the deep links so a shared tree opens straight in the app.",
            image: "/projects/alltrees-design/website.jpg",
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
        description:
          "The movement design behind my climbing routes — choosing holds, choosing the move, and testing whether the body agrees.",
        tags: ["Routesetting", "Movement Design"],
        slug: "route-design",
        waveGroup: "routesetting",
        image: "/projects/routesetting/september-boulder.jpg",
        heroImageFirst: true,
        body: [
          {
            type: "text",
            text: "I set boulder problems and routes at three gyms: Active Climbing in Athens, GA, the Brandeis Climbing Wall in Waltham, MA, and Central Rock Gym in Watertown, MA. Every route starts from the same limited set of holds and the same wall — the design problem is finding movement inside those constraints that reads clearly at its grade, feels good in the body, and doesn't leave an accidental easier way through.",
          },

          {
            type: "cards",
            items: [
              {
                title: "Deciding movement",
                subtitle: "Step 1 ⇄ Step 2",
                text: "The move and the grade come first, and they tell you roughly what holds you need — how positive, what orientation, how far apart.",
              },
              {
                title: "Selecting holds",
                subtitle: "Step 2 ⇄ Step 1",
                text: "The holds and the wall angle are the constraints you build inside. If none of your hold options fit the move, the move must change.",
              },
              {
                title: "Assembly",
                subtitle: "Step 3",
                text: "Positions, angles and bolt-up. The plan meets the actual wall, where reach and spacing stop being theoretical.",
              },
              {
                title: "Testing",
                subtitle: "Step 4",
                text: "Climb it. The body is the only reliable judge of whether the movement reads the way it looked from the ground.",
              },
            ],
          },

          {
            type: "beat",
            kicker: "The Material",
            heading: "A hold is a set of constraints wearing a shape.",
            text: "Size decides how much hand fits. Incut decides how secure the move feels. A macro gets picked for its profile and for how striking it looks on the wall — changing where the body can be is what follows from that. None of it tells you what to set: the bin and the wall angle are the constraint you work inside, not the prompt.",
          },
          {
            type: "images",
            images: [
              "/projects/routesetting/holds-set.jpg",
              "/projects/routesetting/holds-volumes.jpg",
              "/projects/routesetting/holds-macro.jpg",
              "/projects/routesetting/holds-feature.jpg",
            ],
          },
          {
            type: "text",
            text: "Hold images above are manufacturer product photographs, included to show the range of shapes a set draws from.",
          },

          {
            // Two ideas do not need a full-viewport headline in front of
            // them — but they do need a sentence, or they read as two
            // boxes that arrived from nowhere. The label carries what the
            // deleted beat used to say, in one line instead of a screen.
            type: "cards",
            label: "How you know a move will work before anyone tries it",
            columns: 2,
            items: [
              {
                title: "Climbing mechanics",
                subtitle: "Years of doing and watching",
                text: "Where weight has to sit, what directions a body can pull in, how long a foot holds. Physics you've felt, not calculated.",
              },
              {
                title: "A library of moves",
                subtitle: "Known solutions",
                text: "Move types with known requirements. Build a climb around one and you know roughly what it will ask for.",
              },
            ],
          },

          {
            type: "beat",
            kicker: "Same Move, Different Setups",
            heading: "Change one condition and it stops being the same move.",
            text: "Four versions of the same movement, ordered by how much precision each one demands. What differs between them is the start hold — how incut it is and how you grip it — the angle of the wall, and what the landing asks for.",
          },
          {
            type: "move-comparison",
            label: "Four setups",
            clips: [
              {
                src: "/projects/routesetting/move-steep.mp4",
                poster: "/projects/routesetting/move-steep.jpg",
                variable: "Single jug, forward grip, large foot",
                rank: 1,
                note: "Overhand off one jug onto a slab volume. The foot is big and the handhold is good, so the move asks for very little precision.",
              },
              {
                src: "/projects/routesetting/move-overhang.mp4",
                poster: "/projects/routesetting/move-overhang.jpg",
                variable: "Slight overhang, two opposing jugs",
                rank: 2,
                note: "Momentum is the constraint — matching the left jug on the last swing generates enough of it. The landing balances over the foot first, then lets the upper body keep travelling until the hands reach the hold.",
              },
              {
                src: "/projects/routesetting/move-slab.mp4",
                poster: "/projects/routesetting/move-slab.jpg",
                variable: "Low angle, downturned catch",
                rank: 3,
                note: "Starts from two opposing jugs. Because the catch hold is downturned, the far foot has to find opposition before the position is stable.",
              },
              {
                src: "/projects/routesetting/move-vertical.mp4",
                poster: "/projects/routesetting/move-vertical.jpg",
                variable: "Flat jug, underhand grip, no-hands landing",
                rank: 4,
                note: "A flat, barely incut jug taken underhand — very little security in the hand. The no-hands landing only works with stacked hips and a committed foot placement.",
              },
            ],
          },
          {
            type: "beat",
            kicker: "One I Set",
            heading: "The line traces one of mine, from the first hold to the anchor.",
          },
          {
            type: "route-trace",
            image: "/projects/routesetting/traced-route.jpg",
            alt: "A lead wall with one of my routes traced from the first hold to the anchor",
            viewBox: "0 0 1000 1333",
            path: "M 526 1272 L 517 1242 L 516 1211 L 516 1181 L 505 1150 L 491 1120 L 480 1059 L 472 1028 L 470 998 L 467 967 L 465 937 L 466 906 L 471 876 L 480 846 L 489 815 L 501 785 L 518 754 L 536 708 L 547 678 L 552 647 L 559 617 L 563 587 L 567 556 L 570 526 L 573 495 L 575 465 L 576 434 L 576 404 L 576 373 L 577 343 L 574 312 L 567 282 L 559 251 L 550 221 L 538 190 L 531 160 L 528 129 L 526 99 L 524 69 L 524 38 L 524 8",
          },

          {
            type: "gallery",
            label: "More of what I've set",
            images: [
              "/projects/routesetting/lead-wall-blue.jpg",
              "/projects/routesetting/august-lead-wall.jpg",
              "/projects/routesetting/route-1.jpg",
              "/projects/routesetting/route-2.jpg",
              "/projects/routesetting/cover.jpg",
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
        heroLayout: "split",
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
        heroLayout: "split",
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
        heroLayout: "split",
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
        heroLayout: "split",
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
        heroLayout: "split",
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
        heroLayout: "split",
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
        link: "https://www.laurelmoonmag.com/riley-byers-in-which-illness-is-a-dull-thing-with-feathers",
        linkLabel: "Read the full piece on Laurel Moon",
        tagLabel: "Poetry",
        featured: true,
        year: "2023",
      },
      {
        title: "Achieving Godhood",
        description: "A prose piece published in The Cairn.",
        tags: ["Prose"],
        tagLabel: "Prose",
        year: "2024",
        link: "https://thecairnstonehill.org/achieving-godhood/",
        linkLabel: "Read the full piece on The Cairn",
      },
      {
        title: "A Gull Calls Me",
        description:
          "A poem I published anonymously in the Touch Grass anthology from Antelope Hill Publishing.",
        tags: ["Poetry"],
        tagLabel: "Poetry",
        year: "2023",
        link: "https://antelopehillpublishing.com/product/touch-grass-antelope-hill-writing-competition-2023/",
        linkLabel: "Buy the anthology to read it",
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
