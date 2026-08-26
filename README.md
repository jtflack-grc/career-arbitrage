# Career Arbitrage

Career Arbitrage is a static, privacy-friendly career decision simulator. It asks users to choose between work styles and real-world tradeoffs before revealing career titles.

## What it does

- 30 scenario-based decisions across work style, school, money, schedule, patient contact, science, stress and optionality.
- Hidden preference profile across 14 dimensions.
- 21 career paths spanning healthcare, technology, engineering, business and wild cards.
- Ranked results with explicit strengths and friction points.
- Editable age-18-to-35 “wealth race” for three selected careers.
- No account, analytics, backend, cookies or personal data collection.

## Run locally

Because this is a static ES-module app, use any static server rather than opening `index.html` directly.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Tests

```bash
npm test
npm run check
```

## GitHub Pages

Publish the repository from the `main` branch root. No build step is required.

## Modeling philosophy

This is not a validated vocational assessment. It is a transparent decision-support toy that makes tradeoffs explicit. Salary and tuition values are dated estimates and should be replaced with school/employer-specific figures before making a real education decision.

The key design rule is: **do not ask “what career do you want?” before the user has reacted to the work and tradeoffs.**
