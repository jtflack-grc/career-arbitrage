# Cardinal Career Arbitrage — Data Model v0.2

Cardinal Career Arbitrage is a Central North Carolina decision-support extension of Career Arbitrage. It is intended to help high-school seniors compare post-high-school routes without assuming that a four-year degree, community college, apprenticeship, military service, direct work, or structured service year represents a universally superior definition of success.

## Core rule

There is no universal career-quality score.

Cardinal stores observable facts and editorial descriptors separately. The student supplies the value judgment through their own stated tradeoffs.

A route can be excellent for one student and terrible for another without changing its underlying data.

## Three distinct objects

### Routes

A route is the post-high-school mechanism used to acquire training, experience, education, income, or credentials.

Examples:
- public four-year college
- community-college career credential
- AA/AS transfer
- GAP youth apprenticeship
- NC FAME
- active-duty technical military service
- Guard / Reserve + civilian college/work
- ROTC / commissioning
- direct work
- AmeriCorps / structured service year

Routes carry tradeoffs such as cost burden, time to income, earn-while-learning potential, geographic control, service obligation, and credential specificity.

A route is not an occupation.

### Programs

A program is a named education/training offering from an institution or structured employer partnership.

Examples:
- GTCC Aviation Systems Technology
- GTCC Mechatronics
- FAME Advanced Manufacturing Technician
- Forsyth Medical Laboratory Technology
- NC A&T Electrical Engineering
- UNCG Information Systems & Supply Chain Management

Programs map to zero or more occupations using explicit relationship types:
- `direct`: the program is intentionally designed to prepare for the named occupation/credential
- `strong`: the occupation is a common and well-supported destination
- `adjacent`: the program can support the occupation, usually with experience, specialization, or additional training
- `exploratory`: a route can expose or lead toward the occupation but should not be presented as a deterministic on-ramp

Program `onRampClarity` is intentionally not a quality score:
1. Academic/gateway program; little direct occupational identity
2. Diffuse professional outcome
3. Broad technical/business family; internships/specialization matter materially
4. Strong occupational family
5. Defined credential or highly deterministic occupational pathway

A low value can be exactly correct for a transfer degree. It does not mean the program is bad.

### Occupations

Occupations are canonical labor-market destinations, preferably aligned to federal SOC codes.

Occupations contain sourced evidence such as wage/opening snapshots and editorial preference descriptors such as income, remote potential, contact load, physical intensity, acute pressure, credential moat and exit-option density.

Descriptors use 0–100 as a normalized amount of the named attribute. Higher does not mean better.

## Central NC cluster overlay

Occupations and programs can attach to local opportunity clusters:
- PTI Aerospace & Aviation
- Advanced Manufacturing & Automation
- Triad Healthcare
- Life Sciences & Regulated Manufacturing
- I-40 / I-85 Logistics Corridor
- Triangle Technology & Biotech
- Charlotte Finance, Energy & Corporate Tech
- Public Service & Infrastructure

Cluster evidence carries a status:
- `established`
- `expanding`
- `committed-emerging`
- `speculative`

Announced projects must not be counted as current employment merely because a future job commitment is large.

## Provenance

Every factual dataset record should reference source IDs from `sources.js`.

Preferred sources include BLS/OEWS, NC Commerce, NCES CIP-SOC, current institutional catalogs, apprenticeship documentation, DFAS/VA/NCNG, and official employer/economic-development sources.

Editorial descriptors are model judgments and should never be represented as externally measured facts.

## Decision pipeline

The playable beta at `cardinal.html` implements:

1. **Route sieve** — select every post-high-school mechanism the student is genuinely willing to investigate.
2. **Hard vetoes / kill list** — only explicit limits eliminate routes or occupations.
3. **Tradeoff weighting** — ordinary preferences rank survivors but never silently remove them.
4. **Ordinary Tuesday calibration** — five career-title-blind workday scenarios refine lived-work preferences.
5. **Occupation reveal** — surviving occupations are ranked by compatibility with stated preferences.
6. **Program projection** — actual regional programs are connected back to surviving occupations using direct/strong/adjacent/exploratory relationships.
7. **Tradeoff trace** — the result page shows what was eliminated and why.
8. **Evidence links** — top result sources are visible in the beta.

The beta intentionally stops before a full age-30/35 money model and before bulk ingestion of the target 80–90 occupations / 100–150 programs.

## Scoring semantics

### Preferences are not vetoes

A student saying “remote work is very important” weights remote-compatible occupations upward but does not eliminate electricians, aviation, manufacturing or healthcare.

A student saying “remote capability is basically required” creates an explicit minimum and can eliminate occupations that fail it.

The same distinction exists for human contact, physical work, acute pressure, schedule burden and service obligation.

### Missing data do not eliminate

If a preferred or limited dimension is unknown for a record, Cardinal reports lower evidence coverage / unknown-limit evidence. Missing data do not silently disqualify a route or occupation.

### Program alignment is not school quality

The program projection score is the best surviving occupation compatibility multiplied by the explicit relationship strength between that program and occupation. It is a path-alignment signal only, not an institutional ranking.

## Validation guardrails

`validateCardinalData()` rejects duplicate IDs, malformed SOC codes, orphan references, invalid relationship/route types, missing occupation dimensions, descriptor values outside 0–100, non-HTTPS sources, missing source dates, and universal score fields such as `qualityScore`, `prestigeScore`, and `successScore`.

Automated tests additionally verify that route preferences do not masquerade as vetoes, hard limits do eliminate conflicting records, Tuesday calibration preserves hard limits, and program projection cannot revive an occupation eliminated by a hard constraint.

These checks are intentionally opinionated. Cardinal is a decision-support system, not a prestige-ranking engine.
