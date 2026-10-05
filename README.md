# GreenBuild CI

Institutional homepage for GreenBuild SAS. Next.js App Router, TypeScript, GSAP ScrollTrigger and Lenis. French-first content based on the supplied marketing brief.

## Run

```sh
npm ci
npm run dev
```

```sh
npm run typecheck
npm run build
npm start
```

## Implemented

- Photorealistic hero, skippable first-session cinematic intro and scroll camera choreography.
- Pinned, reversible four-stage photographic construction: BTC walls, structure, facades, inhabited campus. Conceptual renders, not a verified architectural plan.
- Vision, Man pilot (approximately 310 planned furnished homes), campus life horizontal scroll, BTC, African ambition, investment, FAQ, contact and footer.
- Fixed branded navigation, active chapters, page progress, keyboard focus, intro skip, reduced-motion static experience; animation cleanup on unmount.
- Contact and job applications persist on the server. Private PDF resumes, inbox statuses and content publishing are managed at `/admin`. No automatic email is sent.

## Before production

Configure admin secrets, a persistent disk and SITE_URL before activating the server. Confirm official contact details, legal/privacy text, project status and architecture. Replace conceptual illustrations with approved campus renderings when supplied. The header wordmark is a temporary typographic treatment; the attached official logo appears in the contact section. No invented team, news, opening date, prices or impact percentages are published. Admin installation and hosting requirements: [docs/admin-deployment.md](docs/admin-deployment.md).

Typography uses Google Fonts with system fallbacks. Host font assets locally if external font requests are undesirable.

Visual assets and generation brief: [docs/visual-direction.md](docs/visual-direction.md).

Campus gallery uses native manual scrolling with arrows and accessible detail dialogs; its former vertical-scroll pin is removed.
