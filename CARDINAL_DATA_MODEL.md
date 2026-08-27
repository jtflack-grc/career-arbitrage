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

## Decision engine semantics

The Cardinal engine now implements the first three decision stages.

### 1. Route sieve

The student explicitly selects every post-high-school route they are genuinely willing to investigate. Route types that are not selected are removed with an explanation trace. The application must present four-year college, community college, apprenticeship, active duty, Guard/Reserve, ROTC, direct work, and structured service as peer route types rather than a prestige ladder.

### 2. Hard limits are different from preferences

A hard limit is an explicit non-negotiable. Examples:
- `humanContact.max = 25`
- `acutePressure.max = 35`
- `remotePotential.min = 70`
- `serviceObligation.max = 20`

Hard limits can eliminate a route or occupation.

A normal preference never eliminates anything. It only affects compatibility ranking. For example, saying remote work is "very important" pushes remote-compatible occupations upward but leaves an electrician visible; saying remote work is "close to a requirement" creates a real minimum and can remove onsite-only occupations.

This distinction is intentional and must survive future UI work.

### 3. Weighted preference matching

Preferences are represented as a desired target from 0–100 plus an importance weight. The engine scores closeness to the student's target only across dimensions the student actually weighted.

Example:

```js
{
  occupationPreferences: {
    remotePotential: { target:100, weight:5 },
    matureIncome: { target:100, weight:4 },
    humanContact: { target:0, weight:3 }
  }
}
```

Compatibility is not career quality. A 90% match means "close to the tradeoffs this student stated," not "a 90/100 career."

If a candidate lacks data for a weighted dimension, Cardinal does not silently disqualify it. The engine reports lower evidence coverage and returns the unknown field so the UI can say the recommendation is less certain.

### 4. Explanation trace / “what you are giving up”

Every elimination includes its explicit reason and threshold. `evaluateCardinal()` summarizes how many routes and occupations were removed by each stated constraint. This is intended to support a UI message such as:

> Requiring high remote compatibility removed these onsite career families from consideration.

The system should make the cost of a preference visible instead of magically hiding alternatives.

## Career-blind sieve question bank

`src/cardinal/sieve.js` contains the first career-title-blind question module. It asks about:
- routes the student is willing to investigate
- education/training cost
- speed to income
- earn-while-learning value
- location control
- structured obligation
- human/customer/patient contact
- physical work
- acute/emergency pressure
- schedule burden
- eventual remote flexibility
- mature income ceiling
- first-job certainty
- labor-market depth versus specialty

Question options translate declaratively into preferences or hard limits. The question bank does not name occupations before the reveal.

The question wording deliberately separates "prefer" from "hard no" and separates acute/emergency pressure from ordinary responsibility for accurate work.

## Remaining stages

The next bounded stages are:

4. **Ordinary Tuesday scenarios** — refine workday preferences after broad routes remain viable.
5. **Program / occupation projection** — connect surviving occupations to real Central NC programs without overstating broad-degree determinism.
6. **Local overlay** — compare Triad depth and nearby Raleigh/Charlotte options without fabricating local certainty.
7. **Money model** — compare training cost, earnings while learning, debt, age at first income, and age-30/35 financial scenarios.
8. **Catch / failure modes** — explicitly explain what could make each surviving route go badly.
9. **Next experiment** — recommend a concrete visit, shadow, conversation, application, or small trial rather than commanding a career choice.

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

The decision-profile parser also rejects unknown route types, unknown preference/limit dimensions, malformed hard limits, and invalid answer IDs.

These checks are intentionally opinionated. Cardinal is a decision-support system, not a prestige-ranking engine.
