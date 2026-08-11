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
  // `description` if omitted.
  details?: string;
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
        details:
          "AllTrees is a cross-platform (iOS-first) social mapping app where a community of climbers crowdsources a live map of climbable trees. Users drop pins for trees they find, add photos and difficulty ratings, log ascents, write reviews, and flag conditions like private property or dead limbs. Reports past a threshold trigger automatic verification, and community moderation keeps the map trustworthy without a human reviewing every pin. It's built around the same idea as a climbing route database like Mountain Project, applied to trees: every tree gets its own page with a star rating, a leaf-icon difficulty scale, who logged the first ascent, live-reported conditions, and a review thread.\n\nBeyond the core map, the app leans into discovery and community: an AI species ID feature suggests the most likely species from a photo, weighted by GPS location; a \"For You\" recommendation feed scores trees by species affinity, difficulty, and geography; and a profile system assigns a \"climber archetype\" and tracks stats like farthest trees apart and total ascents. Sign-in works via email, Google, or Apple, with a guest-browsing mode for anyone who just wants to look around, and a premium tier (\"Treemium\") unlocks personalization and cosmetic features via RevenueCat.\n\nStill in first-round beta, so there's no usage data yet — but the core map, tree pages, ascent logging, search/filtering, and profile system are all built and working.",
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
        gallery: [
          "/projects/alltrees/tree-detail.jpg",
          "/projects/alltrees/map.jpg",
          "/projects/alltrees/search-filters.jpg",
          "/projects/alltrees/search-radius.jpg",
          "/projects/alltrees/profile.jpg",
          "/projects/alltrees/stats.jpg",
          "/projects/alltrees/explore-feed.jpg",
        ],
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
        tags: ["TypeScript", "Next.js", "Tailwind CSS"],
        link: "#",
      },
      {
        title: "Routesetting",
        description:
          "Designing boulder problems and routes at three different gyms — same holds, same wall, a hundred ways to get the movement wrong.",
        tagLabel: "Routesetting",
        details:
          "I set boulder problems and routes at three different gyms: Active Climbing in Athens, GA, the Brandeis Climbing Wall in Waltham, MA, and Central Rock Gym in Watertown, MA. Setting is its own kind of design problem — working within a fixed set of holds and a wall's geometry to build movement that reads clearly at a given grade, feels good in the body, and doesn't have an accidental easier way through it.",
        tags: ["Routesetting"],
        image: "/projects/routesetting/cover.jpg",
        video: "/projects/routesetting/setting.mp4",
        slug: "routesetting",
        gallery: [
          "/projects/routesetting/route-1.jpg",
          "/projects/routesetting/route-2.jpg",
        ],
      },
      {
        title: "Wall Book Holders",
        description:
          "A 3D-printed mount that holds your book open to the page — no drilling, no bookmark, no losing your spot.",
        tagLabel: "3D Print Build",
        details:
          "A set of wall-mounted book holders that keep a book open to your place, designed in Fusion 360 and 3D printed. Each one is designed to install with Command Velcro strips rather than hardware, so it goes up (and comes down) without putting holes in the wall.\n\nEach bracket prints in two flat halves that slot together and get glued into one rigid piece — easier to print reliably than the full 3D shape in one go, and it keeps the print time and material down.",
        tags: ["Fusion 360", "3D Printing"],
        year: "2024",
        slug: "wall-book-holders",
        image: "/projects/book-holder/room.jpg",
        gallery: [
          "/projects/book-holder/shelves.jpg",
          "/projects/book-holder/render.png",
        ],
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
        details:
          "For an electrical engineering class, I built a functioning digital clock using a WHDTS 4-bit electronic clock DIY kit as the electronics base, then designed and 3D printed a custom case for it in Fusion 360 rather than using the kit's stock housing.\n\nThe brief I set for myself: a minimalist case with easy-to-reach buttons, a clearly visible clock face, and a design that never needs to come off the clock. I researched hinge and enclosure ideas before sketching out several case concepts by hand, then modeled the final version — a faceted black case with gold trim, a cutout window for the display, and two accessible buttons — piece by piece in Fusion 360.",
        tags: ["Fusion 360", "3D Printing", "Circuit Assembly", "Soldering"],
        year: "2019",
        slug: "digital-clock",
        image: "/projects/clock/render-hero.jpg",
        gallery: [
          "/projects/clock/brainstorm.jpg",
          "/projects/clock/technical-drawing.jpg",
        ],
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
        details:
          "For a shop class project, I was tasked with improving how our engineering room stored 3D-printer filament — at the time it lived in a separate area and had to be sorted through and carried to the printers for every print. Working with a classmate, I designed a stand that holds multiple spools directly above the printers, attaches to the printer enclosure frame, and keeps spools locked in place but removable by hand.\n\nI researched lazy susans (which use bearings to spin) and the filament connectors already built into the printers before sketching a rotating, tiered stand concept. In the end we moved away from the lazy susan plan and designed a snap-lock piece modeled after the connector the printers already used, built into the existing structure around the printers rather than a freestanding base — that gave the heaviest, fully-loaded spools much more support.",
        tags: ["Fusion 360", "3D Printing", "CAD"],
        year: "2019",
        slug: "filament-stand",
        image: "/projects/filament-holder/render-stand.jpg",
        gallery: [
          "/projects/filament-holder/brainstorm.jpg",
          "/projects/filament-holder/render-lock.jpg",
        ],
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
          { src: "/art/leopard.jpg" },
          { src: "/art/red-portrait.jpg" },
          { src: "/art/two-figures.jpg" },
          { src: "/art/pink-hair-portrait.jpg" },
          { src: "/art/bird.jpg" },
          { src: "/art/abstract-blue-yellow.jpg" },
          { src: "/art/abstract-bw.jpg" },
          { src: "/art/abstract-green.jpg" },
        ],
      },
      {
        title: "Henna",
        caption:
          "Mostly freehand, with the occasional reference image — often prompted by a single word.",
        images: [
          { src: "/art/henna/swirl-forearm.jpg", name: "Joy" },
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
    projects: [
      {
        title: "Pete Assets",
        description:
          "The character art and sprites behind Pete the Snail, painted in Krita — full story under Play.",
        tags: ["Krita", "Character Design"],
        slug: "pete-the-snail",
      },
      {
        title: "UI/UX Design",
        description:
          "The interface behind AllTrees — full story under Build.",
        tags: ["UI/UX"],
        slug: "alltrees",
      },
      {
        title: "Branding",
        description:
          "The icon and logo behind AllTrees — full story under Build.",
        tags: ["Branding"],
        slug: "alltrees",
      },
      {
        title: "Route Design",
        description:
          "The movement design behind my climbing routes — full story under Build.",
        tags: ["Routesetting"],
        slug: "routesetting",
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
        details:
          "A Unity/C# game design, currently paused: a Snake-inspired twist where you play as a snail named Pete leaving a slime trail behind you. Encircle ants with the trail to collect them — the trail fades after a few seconds if you don't loop it around something first. The fuller vision was for your trail to grow longer as you collect bigger colonies, working toward destroying the ant hill.\n\nNo gameplay footage — I can't currently reinstall Unity on this machine to record it — but the core movement, slime-trail tracking, and ant-following mechanics were built and working.",
        tags: ["Unity", "C#", "Game Design", "Krita"],
        year: "2023",
        slug: "pete-the-snail",
        image: "/projects/snail/pete-portrait.png",
        gallery: [
          "/projects/snail/pete-idle.gif",
          "/projects/snail/ant-sheet.png",
        ],
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
        details:
          "Browser-based VR game built with A-Frame and the Ammo.js physics engine, created as a 3-person final project for a 3D animation course. The game spans three connected levels built by each team member; this is mine — a first-person maze of stone platforms surrounded by water where the player is pursued by physics-driven enemies, with reaching the wrong thing ending the game and reaching the right thing advancing it.\n\nFor my level, I modeled, rigged, and animated the fire boy and water girl characters (along with custom signage) myself, and wrote the game logic in JavaScript: a chase component that tracks the player's position each frame, moves enemies toward them, and triggers a game-over or level transition on contact.",
        tags: ["A-Frame", "JavaScript", "Blender", "Physics"],
        tagLabel: "VR Game Design",
        link: "#",
        featured: true,
        image: "/projects/fire-and-water/cover.jpg",
        year: "2021",
        slug: "fire-and-water",
        section: "Games",
        gallery: [
          "/projects/fire-and-water/doorway.jpg",
          "/projects/fire-and-water/fireboy.png",
          "/projects/fire-and-water/watergirl.png",
        ],
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
        image: "/projects/entrance/cover.jpg",
        video: "/projects/entrance/entrance.mp4",
        slug: "entrance",
        year: "2025",
        section: "Videos",
      },
      {
        title: "Blackjack",
        description:
          "A short Blender character animation with more personality than its runtime should allow.",
        details:
          "A short character animation piece made almost entirely in Blender, for a 3D animation class.",
        tags: ["3D Animation", "Blender"],
        tagLabel: "3D Animation",
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
        slug: "ebbinghaus-illusion-grey-parrots",
        image: "/projects/ebbinghaus-illusion-grey-parrots/parrot-cover-v2.jpg",
      },
      {
        title: "Contrafreeloading in Grey Parrots",
        description:
          "Would you rather work for your food, or eat the same thing for free? Grey parrots have opinions — I helped keep this study running at The Alex Foundation.",
        details:
          "A study at The Alex Foundation (Dr. Irene Pepperberg's lab) led by PhD student Alana Carroll, looking at contrafreeloading in Grey parrots — the well-documented phenomenon, seen across many species, where animals given a choice will sometimes prefer to \"work\" for food (e.g., extracting it from something) over eating identical food that's freely available. I helped keep data collection running for the study while Alana was away.\n\nBirds (Athena, Franco, Griffin, Lucci, and Pepper) chose between food presented loose on a tray versus food wrapped in scrunched-up paper they had to work to open, across three condition types — \"super,\" \"classic,\" and \"calculated.\" A separate round of food-preference testing (pairwise choices between items like almonds, cashews, pecans, crackers, cereal, and safflower seed) was run per bird beforehand, so each parrot's trials used food it was already known to prefer.\n\nThe design builds on two prior contrafreeloading studies from the same lab: Smith, Bastos, Taylor & Pepperberg (2022, Scientific Reports), comparing kea to Grey parrots, and Carroll & Pepperberg (2024/2025, Journal of Comparative Psychology), comparing umbrella cockatoos to Grey parrots. A paper specific to this round of Grey parrot data hasn't come out yet, as far as I can find — I'm trying to track down its status.",
        tags: ["Animal Cognition", "Data Collection", "Psychology Research"],
        tagLabel: "Cognition Research",
        year: "2025",
        slug: "contrafreeloading-parrots",
        link: "https://pubmed.ncbi.nlm.nih.gov/39250240/",
        linkLabel: "View related publication",
        image: "/projects/contrafreeloading-parrots/overall-contrafreeloading.jpg",
        gallery: [
          "/projects/contrafreeloading-parrots/contrafreeloading-by-condition.jpg",
        ],
      },
      {
        title: "Cognitive Flexibility Research",
        description:
          "An EEG eye-tracking internship studying how the brain shifts gears — co-authored work submitted to the Cognitive Neuroscience Society.",
        featured: true,
        details:
          "An internship at the Clinical and Cognitive Neuroscience Lab at the University of Georgia, run by Dr. McDowell and Dr. Clemenz, working under grad student mentor Beryl Huang on her cognitive flexibility research in young adults. The lab's broader work spans schizophrenia, sensory processing, and aging, using MRI, fMRI, EEG, and eye-tracking.\n\nMy role centered on the technical side of an EEG eye-tracking paradigm: setting up and troubleshooting the hardware, running timing tests, calibrating the eye tracker, and helping design the study's preregistration. I also picked up R to build a script that converts raw eye-movement data (recorded per participant as a large Excel export) into clean PDF reports of eye position and velocity over time — the processing pipeline the study now uses for every participant. Later on I was trained to score EEG data by hand as well, ahead of full-scale data collection.\n\nThe project — an interactive ocular motor set-shifting task designed to evoke distinct electrophysiological markers across stages of cognitive flexibility — was submitted to the Cognitive Neuroscience Society's 2023 meeting with me as a co-author.\n\nOutside the core project, I sat in on other work in the lab (a clozapine drug trial using EEG and eye-tracking, an fMRI study of brain structure in psychosis) and gave weekly presentations to my mentor on assigned and self-chosen readings — a big part of how I found the areas of psychology (autism, executive function, theory of mind) I'm most interested in continuing to explore.",
        tags: ["R", "EEG", "Eye-Tracking", "Psychology Research", "Data Analysis"],
        tagLabel: "Neuroscience Research",
        year: "2023",
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
        details:
          "A remote research position at the Cornell Lab of Ornithology, working under Connor Wood and Michael Pardo at the K. Lisa Yang Center for Conservation Bioacoustics on a large bird call database. I used R to clean and optimize the dataset, improving how efficiently it could be accessed for later machine learning work, and built an unsupervised classification cluster analysis using feature embeddings in R to categorize chickadee vocalizations — cutting down the human hours needed to process large amounts of audio data. I also wrote R code to identify the ratios of different chickadee call types within complex datasets, helping distinguish call patterns, and manually identified call types from large audio datasets by hand to help verify and validate the automated analysis tools.\n\nMuch of the pipeline work involved filtering huge detection sets down to something usable: matching site/date combinations against a curated set of goshawk-call mornings, applying BirdNET confidence thresholds (pr(tp) > 0.90/0.95/0.975/0.99) to control for false positives, restricting to a consistent early-morning window to avoid conflating dawn and dusk vocal activity, and setting minimum call-count cutoffs per site/day. From there I generated before/after interval ratio comparisons — like the ones below — to look at how chickadee call rates shifted around a goshawk detection.\n\nThat work became a co-authored paper, \"Passive acoustic monitoring reveals surprising patterns of avian community antipredator behavior at a regional scale,\" accepted into Ecology on January 29, 2026 and since published.",
        tags: ["R", "Data Cleaning", "Cluster Analysis", "Machine Learning", "Bioacoustics"],
        tagLabel: "Bioacoustics Research",
        year: "2024",
        slug: "bird-call-research",
        link: "https://doi.org/10.1002/ecy.70362",
        linkLabel: "View publication",
        image: "/projects/bird-call-research/kmeans-full.png",
        gallery: [
          "/projects/bird-call-research/kmeans-subset.png",
          "/projects/bird-call-research/pcoa-plot.png",
          "/projects/bird-call-research/goshawk-interval-ratios.png",
          "/projects/bird-call-research/goshawk-average-ratios.png",
          "/projects/bird-call-research/body-size-comparison.png",
        ],
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
        linkLabel: "Read on Laurel Moon",
        tagLabel: "Poetry",
        featured: true,
        year: "2023",
      },
      {
        title: "Achieving Godhood",
        description: "A prose piece about becoming something more — published in The Cairn.",
        tags: ["Prose"],
        tagLabel: "Prose",
        year: "2024",
        link: "https://thecairnstonehill.org/achieving-godhood/",
        linkLabel: "Read on The Cairn",
      },
      {
        title: "A Gull Calls Me",
        description:
          "A poem I published under a pen name — included in the Touch Grass anthology.",
        tags: ["Poetry"],
        tagLabel: "Poetry",
        year: "2023",
        link: "https://antelopehillpublishing.com/product/touch-grass-antelope-hill-writing-competition-2023/",
        linkLabel: "View the anthology",
      },
      {
        title: "I am unsure of the validity of my claims",
        description:
          "A chapbook that interrogates my own memory — seeking a publisher.",
        tags: ["Poetry", "Chapbook"],
        tagLabel: "Poetry Chapbook",
        slug: "unsure-of-the-validity",
        image: "/write/chapbook/cover.jpg",
      },
      {
        title: "Sometimes It's All Consuming",
        description:
          "A chapbook about the parts of my mind that don't stay quiet — seeking a publisher.",
        tags: ["Poetry", "Chapbook"],
        tagLabel: "Poetry Chapbook",
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
// fuller entry when the same project shows up under more than one
// discipline (e.g. AllTrees is also cross-referenced as "UI/UX Design"
// and "Branding" under Design, and Pete the Snail as "Pete Assets" —
// those cross-reference stubs carry no year/image/details of their own).
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

// One entry per slug — when the same project is cross-referenced under
// more than one discipline, the fullest entry wins. Used by both
// getProjectBySlug (so /projects/pete-the-snail resolves to the full
// Play entry, not the bare "Pete Assets" stub under Design — that stub
// winning was a real bug: it has no description/gallery of its own, and
// its categoryId sent the page's back-arrow to /design instead of
// /play) and chronologicalProjects below.
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
