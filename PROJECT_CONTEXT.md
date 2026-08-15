# PROJECT_CONTEXT.md

Authoritative context for the CUY Lab website repository. This folder is the source of truth.

## What this is

`cuylab/cuylab.github.io` — the public website of the **Computational Urban Systems (CUY) Lab**, a research group at the Singapore Management University (SMU) focused on human-centric urban informatics.

- **Live site:** https://cuylab.github.io
- **Remote:** https://github.com/cuylab/cuylab.github.io.git (branch `main`)
- **Built with:** [Lab Website Template](https://greene-lab.gitbook.io/lab-website-template-docs) (Greene Lab) — Jekyll 4.3 on GitHub Pages
- **PI:** Matias Quintana

The repo is a fork of the template. Some content is lab-specific; some template placeholders (lorem ipsum, example projects, dummy members) are still in place and are being replaced incrementally.

## Repository structure

### Content — edit these

| Path | Purpose |
|---|---|
| `index.md` | Home page. Uses `feature.html` blocks linking to the main sections. |
| `people/index.md` | People page. Renders `_members` through `portrait` components, filtered by `role`. |
| `publications/index.md` | Publications page. Renders `_data/citations.yaml` through `citation` components. |
| `projects/index.md` | Projects page. Renders `_data/projects.yaml` through `card` components. |
| `news/index.md` | Blog/news index. Renders `_posts` through `post-excerpt`. |
| `contact/index.md` | Contact page — email, LinkedIn, address buttons. |
| `_members/*.md` | One file per lab member. Front matter drives the portrait and member page. |
| `_posts/*.md` | Blog posts, named `YYYY-MM-DD-slug.md`. |
| `images/` | Site images: logo, background, share card, member photos. |
| `404.md`, `README.md`, `LICENSE.md`, `CITATION.cff` | Boilerplate. |

Navigation is generated automatically from the `nav.order` front-matter key on each top-level `index.md`. Pages without `nav` do not appear in the header. Current order:

1. Publications
2. Projects
3. People
4. News
5. Contact

### Member front matter

```yaml
name: Full Name
image: images/photo.jpg
description: Short role line shown under the portrait
affiliation: Institution
role: principal-investigator   # must match a key in _data/types.yaml
aliases: [Other N Name]        # used for publication search matching
links: { home-page:, linkedin:, github:, orcid:, google-scholar: }
interests: [...]               # rendered by _layouts/member.html
education: [{degree:, year:, institution:}]
```

`role` values must match keys defined in `_data/types.yaml` (`principal-investigator`, `postdoc`, `phd`, `postgrad`, `undergrad`, `programmer`, `mascot`) — the role supplies the portrait icon and fallback description. The filters in `people/index.md` must use the same keys.

`links` keys must match entries in `_data/types.yaml`, which supply the icon and the URL pattern (`$VALUE` is substituted). Store only the bare handle/ID, not a full URL.

### Data — `_data/`

| File | Role |
|---|---|
| `orcid.yaml` | ORCID IDs whose publications are pulled automatically. **Input.** |
| `sources.yaml` | Manually curated publications and per-paper overrides (image, tags, buttons). **Input.** |
| `citations.yaml` | **Generated.** Written by the citation pipeline — do not hand-edit. |
| `projects.yaml` | Projects page entries. |
| `types.yaml` | Central map of role/link/button/alert types → icon, text, tooltip, URL pattern. |

### Template machinery — rarely touched

- **`_includes/`** — the component library. Pages are composed by calling these rather than writing HTML: `feature.html`, `card.html`, `portrait.html`, `citation.html`, `button.html`, `section.html`, `float.html`, `tags.html`, `search-box.html`. The generic `list.html` renders any data collection through a chosen component with an optional `filter` expression, auto-grouping by year when dates are present.
- **`_layouts/`** — `default.html` (head/header/content/footer), `post.html`, and `member.html`. `member.html` has been **customised locally** to add the Interests and Education blocks; treat it as lab-specific, not upstream.
- **`_styles/`** — one SCSS partial per component, all imported by `all.scss`. `-theme.scss` holds colours and variables.
- **`_scripts/`** — vanilla JS: `search.js`, `dark-mode.js`, `anchors.js`, `tooltip.js`, `table-wrap.js`, `fetch-tags.js`.
- **`_plugins/*.rb`** — custom Liquid filters the includes depend on (`file_exists`, `file_read`, `data_filter`, `array_filter`, `is_nil`, `regex_strip`). Local Ruby plugins, so the site cannot be built by GitHub's stock Pages builder — it is built in CI.

### Citation pipeline — `_cite/`

`cite.py` reads `_data/orcid.yaml` and `_data/sources.yaml`, fetches metadata through the plugins in `_cite/plugins/` (`orcid.py`, `pubmed.py`, `google-scholar.py`, `sources.py`), and writes `_data/citations.yaml`. Responses are cached in `_cite/.cache/cache.db`. Requires the `GOOGLE_SCHOLAR_API_KEY` repo secret for the Scholar plugin. Runs in CI — not normally run locally.

### CI — `.github/workflows/`

| Workflow | Trigger | Does |
|---|---|---|
| `on-push.yaml` | push to `main` | update citations → build & deploy |
| `on-pull-request.yaml` | PR | preview build |
| `on-schedule.yaml` | weekly, Mon 00:00 UTC | refresh citations, open a PR |
| `on-pages.yaml` | Pages event | deploy hook |
| `update-citations.yaml` | reusable | runs `_cite/cite.py`, commits the result |
| `build-site.yaml` | reusable | Jekyll build + html-proofer |
| `build-preview.yaml` | reusable | PR preview build |
| `first-time-setup.yaml`, `update-url.yaml` | one-off | template bootstrapping |

### Local development

`.docker/run.sh` builds and runs the Jekyll container (`.docker/Dockerfile`), serving on **http://localhost:4000** with live reload on port 35729 and the repo mounted as a volume. This is the intended preview path; a local Ruby/Bundler install against the `Gemfile` also works.

## Conventions

- Content lives in markdown and YAML; HTML/SCSS changes belong in `_includes` / `_styles`, not inline in pages — with the existing exception of `_layouts/member.html`.
- `_data/citations.yaml` is generated output. Change `orcid.yaml` or `sources.yaml` instead.
- Role and link keys must exist in `_data/types.yaml` or they render without an icon.
- Edits should be surgical — targeted changes, not file rewrites.

## Known outstanding items

- Placeholder content is intentionally retained for now: lorem ipsum on the home, publications, and projects pages; template entries in `_data/projects.yaml` and `_data/sources.yaml`; the three dummy member files (`john-doe`, `jane-smith`, `sarah-johnson`); the three example posts.
- `contact/index.md` lists an ETH (`sec.ethz.ch`) email rather than an SMU one, and the LinkedIn button link is empty.
- `_config.yaml` `links.linkedin` is empty.
