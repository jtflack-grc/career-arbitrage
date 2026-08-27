# Cardinal Career Arbitrage — Data Model v0.3

Cardinal Career Arbitrage is a Central North Carolina decision-support tool for high-school seniors comparing post-high-school routes without assuming that a four-year degree, community college, apprenticeship, military service, direct work, or structured service year represents a universally superior definition of success.

## Core rule

There is no universal career-quality score.

Cardinal stores observable facts and editorial descriptors separately. The student supplies the value judgment through stated tradeoffs and work-interest signals. A route can be excellent for one student and terrible for another without changing its underlying data.

## Five distinct object families

### Routes

A route is the mechanism used after high school to acquire training, experience, education, income, or credentials: four-year college, community college, apprenticeship, active-duty service, Guard/Reserve, ROTC, direct work, or structured service/gap year.

Routes carry tradeoffs such as cost burden, time to income, earn-while-learning potential, geographic control, service obligation, and credential specificity. A route is not an occupation.

### Occupations

Occupations are canonical civilian labor-market destinations, preferably aligned to federal SOC codes. They contain sourced evidence such as wage/opening snapshots plus normalized editorial descriptors such as income, remote potential, contact load, physical intensity, acute pressure, credential moat and exit-option density. Higher descriptor values mean more of the named attribute, never better.

### Direct bridge programs

`programs.js` contains a deliberately smaller, evidence-rich set of programs/routes with explicit occupation relationships:
- `direct`
- `strong`
- `adjacent`
- `exploratory`

These power the **Direct Bridges** result panel. They are intentionally stricter than the broad education catalog. `onRampClarity` describes how clearly a program maps toward a first occupational identity; it is not program quality.

### Broad education catalog

`education-catalog.js` is the wide-net exploration layer. It includes current nearby community-college programs and undergraduate majors even when they do not map cleanly to one occupation. This prevents Cardinal from pretending that Biology, History, English, Business Administration, Art, or other broad degrees have deterministic first jobs.

The catalog uses two geographic scopes:
- `triad-core`: Greensboro / High Point / Winston-Salem and nearby Triad institutions
- `central-nc-extended`: useful regional options in the Triangle / Charlotte corridor

The broad catalog is sorted by the student's interest/work signals and visible occupational families. It never receives a universal quality score.

### Military specialty catalog

`military-specialties.js` preserves military career vocabulary rather than flattening service jobs into civilian occupations. Records can be MOS/job-program, AFSC/career, Navy rating/community, Coast Guard rating, Space Force specialty, officer career, or later-service specialty.

Each record can store:
- service
- code / MOS / AFSC / rating / job-program label
- enlisted / officer / warrant / later-service path
- verified service-component availability where modeled
- job family
- optional civilian occupation analogs
- published ASVAB/composite gates where reliably sourced
- provenance

ASVAB and line-score data are **qualification gates, not preference scores**. If a score is not reliably sourced in Cardinal, the interface tells the student to verify current requirements rather than inventing one.

The Marine Corps is modeled with entry job programs / occupational-field families where that better reflects how recruits actually contract and receive specialties. Later-service selections such as MARSOC are not presented as immediate high-school entry options.

## Interest signals

`interests.js` adds a short career-title-blind layer inspired by the structural approach used by tools such as O*NET/My Next Move and CareerOneStop, which separate interests from other career considerations. Cardinal does not copy their question wording or claim to administer a validated RIASEC instrument.

Cardinal's internal work-pull signals are:
- Build / repair / operate
- Investigate / analyze / troubleshoot
- Create / design
- Help / teach / serve
- Lead / persuade / decide
- Organize / coordinate / execute
- Explain / write / present

These signals sort broad catalogs. They do not override hard route or occupation constraints.

## Central NC cluster overlay

Occupations and direct programs can attach to local opportunity clusters:
- PTI Aerospace & Aviation
- Advanced Manufacturing & Automation
- Triad Healthcare
- Life Sciences & Regulated Manufacturing
- I-40 / I-85 Logistics Corridor
- Triangle Technology & Biotech
- Charlotte Finance, Energy & Corporate Tech
- Public Service & Infrastructure

Cluster evidence carries `established`, `expanding`, `committed-emerging`, or `speculative` status. Announced projects must not be counted as current employment merely because a future job commitment is large.

## Provenance

Every factual catalog record references source IDs from `sources.js`. Preferred sources are official service career pages, current institutional catalogs, BLS/OEWS, NC Commerce, NCES CIP-SOC, apprenticeship documentation, DFAS/VA/NCNG, and official employer/economic-development sources.

Editorial descriptors and interest tags are model judgments and must never be represented as externally measured facts.

## Decision pipeline

The canonical root site implements:

1. **Route sieve** — select every post-high-school mechanism genuinely worth investigating.
2. **Hard vetoes / kill list** — only explicit limits eliminate routes or civilian occupations.
3. **Tradeoff weighting** — preferences rank survivors but never silently remove them.
4. **Interest signal** — seven career-title-blind questions sort the wide education and military catalogs.
5. **Ordinary Tuesday calibration** — lived-work scenarios refine occupation preferences.
6. **Route bargain reveal** — surviving route economics/constraints are shown.
7. **Civilian occupation reveal** — civilian occupations are ranked by compatibility.
8. **Military specialty finder** — appears only when military/ROTC routes survive; component and officer/enlisted semantics are enforced.
9. **Direct bridge projection** — evidence-rich programs connect to visible occupations and selected routes only.
10. **Nearby education net** — broader current majors/programs are surfaced without claiming deterministic job conversion.
11. **Tradeoff trace** — the result page shows what hard constraints removed and why.
12. **Evidence links** — official/sourced references remain visible.

## Scoring semantics

### Preferences are not vetoes

A student saying remote work is very important weights remote-compatible occupations upward but does not eliminate electricians, aviation, manufacturing or healthcare. A student saying remote capability is effectively required creates an explicit minimum and can eliminate conflicting occupations.

### Missing data do not eliminate

If a preferred or limited dimension is unknown, Cardinal reports lower evidence coverage / unknown-limit evidence. Missing data do not silently disqualify a route or occupation.

### Catalog sorting is not quality

Military and education catalog scores mean only “fit with the work signals and surviving civilian occupation families currently visible.” They are not school rankings, branch rankings, prestige scores, or promises of admission/qualification.

## Validation guardrails

`validateCardinalData()` rejects duplicate IDs, malformed SOC codes, orphan references, invalid relationship/route types, missing occupation dimensions, descriptor values outside 0–100, non-HTTPS sources, missing source dates, unknown catalog sources/interest tags, invalid military rank paths, and universal score fields such as `qualityScore`, `prestigeScore`, and `successScore`.

Automated tests additionally verify route/veto semantics, route-congruent program projection, the full 21-rating Coast Guard enlisted inventory, the modeled Space Force enlisted/officer split, six-service military coverage, Guard/Reserve component gating, ROTC officer gating, broad local education coverage, and prevention of four-year leakage into community-college-only playthroughs.
