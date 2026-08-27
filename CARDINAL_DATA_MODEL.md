# Cardinal Career Arbitrage — Data Model v0.1

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

Occupations contain two kinds of data:

**Sourced evidence**
- local wage snapshots
- national employment/openings/growth where available
- entry education
- license/certification information
- regional cluster links
- source provenance

**Editorial preference descriptors**
- early income
- mature income
- entry reliability
- market depth
- Central NC strength
- credential moat
- education-cost burden
- time to full-time income
- earn-while-training potential
- remote potential
- human contact
- physical intensity
- acute/emergency pressure
- schedule burden
- geographic portability
- automation resilience/complementarity
- exit-option density
- self-employment potential
- service obligation

Descriptors use 0–100 as a normalized amount of the named attribute. Higher does not mean better.

For example:
- higher `remotePotential` means more remote-compatible
- higher `physicalIntensity` means more physical work
- higher `acutePressure` means more emergency/acute pressure
- higher `serviceObligation` means more contractual obligation

The future recommendation engine must compare these attributes against what the student says they value. It must never sum them into an unweighted career-quality score.

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

Preferred sources:
- BLS / OOH / OEWS
- NC Commerce D4 and employment projections
- NCES CIP-SOC crosswalk
- current institutional catalogs/program pages
- apprenticeship program documentation
- DFAS / VA / NC National Guard for military economics
- official employer or economic-development material for regional cluster status

Editorial descriptors are model judgments and should never be represented as externally measured facts.

## Seed scope

The first seed deliberately covers representative comparison cases rather than the whole Internet:
- aerospace / aviation
- advanced manufacturing / automation
- skilled trades
- engineering
- computing / data
- business / logistics
- non-bedside and bedside healthcare controls
- public service
- transportation

The architecture should be validated before expanding to the target canonical occupation universe (~80–90 occupations) and regional program set (~100–150 programs/routes).

## Future scoring

The next scoring engine should operate in stages:

1. **Route sieve** — which post-high-school mechanisms is the student willing to consider?
2. **Hard vetoes / kill list** — remove paths that violate absolute constraints such as patient contact, military obligation, four-year schooling, debt ceiling, physical work, or relocation.
3. **Tradeoff weighting** — infer how strongly the student values income, speed, certainty, remote work, ceiling, portability, etc.
4. **Ordinary Tuesday scenarios** — distinguish lived-work preferences after broad routes remain viable.
5. **Local overlay** — compare Central NC depth and nearby Raleigh/Charlotte options without fabricating local certainty.
6. **Money model** — compare training cost, earnings while learning, debt, age at first income, and age-30/35 financial scenarios.
7. **Catch / failure modes** — explicitly explain what could make each surviving route go badly.
8. **Next experiment** — recommend a concrete visit, shadow, conversation, application, or small trial rather than commanding a career choice.

## Validation guardrails

`validateCardinalData()` currently rejects:
- duplicate IDs
- malformed SOC codes
- orphan occupation/program/cluster/source references
- invalid relationship types
- invalid route types
- missing occupation dimensions
- descriptor values outside 0–100
- non-HTTPS sources
- missing source snapshot dates
- universal score fields including `score`, `qualityScore`, `careerQuality`, `prestigeScore`, and `successScore`

These checks are intentionally opinionated. Cardinal is a decision-support system, not a prestige-ranking engine.
