# GreenBuild — cinematic direction v2

Four project-bound photorealistic images generated with the built-in ImageGen tool and packaged as WebP without changing composition. These are conceptual images, not verified architectural plans or photographs of an existing project.

## Asset and prompt set

- `public/images/campus-finished.webp`: Photorealistic 16:9 architectural master of a four-storey sustainable student campus in Man, Côte d’Ivoire. Warm terracotta BTC, off-white slabs, green sun screens, shaded galleries, planted roof and solar panels. U-shaped courtyard, detailed tropical trees, realistically scaled West African adult students. Elevated three-quarter 35mm camera, late-afternoon sunlight, distant mountains, physically realistic materials. No text, logos or watermark.
- `public/images/campus-walls.webp`: Edit the master preserving camera, framing, mountain background and sun. Early construction: ground-floor BTC walls partly elevated, exposed columns and foundations, bare courtyard and brick stacks; upper floors not yet built, no students or finished landscaping.
- `public/images/campus-structure.webp`: Edit the master preserving framing and lighting. Full concrete structure erected, lower BTC masonry mostly installed, upper infill incomplete, no glazing, screens, railing, roof planting or solar panels. Bare courtyard with minimal scaffolding.
- `public/images/campus-facades.webp`: Edit the master preserving framing and geometry. Completed walls, glazing, screens, galleries and solar panels; no students, courtyard plants or roof planting. Finished paving and empty soil planting beds.

## Motion

- First visit in a tab session: approximately 4.6-second architectural opening. Blueprint volumes, wordmark, three narrative beats, five image panels and upward curtain reveal. Escape and the skip control end it immediately. Reduced-motion preference skips it. No artificial loading percentage.
- Hero: full-bleed campus image, entrance zoom, text choreography and scroll parallax.
- Construction: four pinned chapters beginning directly with the walls. Reversible bottom-to-top photographic reveals, scan light, gentle camera zoom and synchronized chapter text/progress. The two former earth/brick chapters are removed.
- Fixed navigation: brand icon, chapter numbering, active-section indicator, project-specific CTA and page progress.

## Verification

Production build and TypeScript are checked before commit. Browser animation QA is not available in this environment; validate mobile crop, pinning, intro skip/repeat behavior, reduced motion and back navigation in an actual browser before release.
