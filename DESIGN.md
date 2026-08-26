# Overview

Creative North Star: **The OLED Decision Terminal.** A calm, high-contrast decision tool that feels more like a precise instrument than a marketing site. The interface is flat, editorial and restrained. The user should notice the question and the tradeoff, not the chrome.

# Colors

- OLED Black `#000000`: primary canvas. Intentional exception to off-black dark-mode convention because true OLED black is a product requirement.
- Carbon `#080b0d`: interactive option and contained-tool surface.
- Raised Carbon `#0d1114`: hover/raised state only.
- Paper `#f4f7f5`: primary text.
- Muted Sage Gray `#a6b0aa`: secondary copy.
- Deep Muted Gray `#758078`: tertiary copy.
- Decision Mint `#79e8b6`: primary action, progress and positive match signal.
- Evidence Blue `#8cbcff`: links and supporting information.
- Caution Amber `#f3ca72`: friction/watch-out labels.
- Soft Red `#ff9aa9`: destructive/restart emphasis.

Use one dominant accent (Decision Mint) and Evidence Blue only for links/support. Do not add gradients.

# Typography

- Display: Iowan Old Style / Palatino / Georgia fallback. Used only for the home and result reveal headlines.
- Interface/body: Aptos / Avenir Next / Segoe UI Variable / system sans fallback.
- Body minimum: 1rem / 16px.
- Reading measure: approximately 68 characters.
- UI hierarchy should be obvious without relying on excessive weights or color.

# Elevation

Flat by default. Structure comes from spacing and low-contrast borders. No decorative shadows, glass effects or floating-card stacks. Raised Carbon is reserved for hover/interaction state, not permanent decoration.

# Components

- Sticky top bar: plain OLED background with a single hairline divider.
- Primary button: mint fill, dark ink, 44px minimum touch target.
- Secondary button: transparent surface with a visible border.
- Scenario option: full-width, left-aligned, 44px+ touch target; one surface level only.
- Progress: thin mint rule rather than a decorative gradient.
- Result match: flat list row separated by dividers, not a card.
- Wealth race: one contained operational surface; table scrolls horizontally on small screens rather than dropping data.
- Tags: quiet outlined metadata, never decorative pills everywhere.

# Do's and Don'ts

## Do
- Design mobile-first for thumbs, interruptions and short sessions.
- Keep every critical feature available on mobile.
- Use 44px minimum interactive targets and obvious keyboard focus.
- Use spacing and typography before introducing containers.
- Explain weak preference signal rather than presenting false confidence.
- Respect reduced-motion preferences.

## Don't
- Do not use gradients, noise textures, glassmorphism or glow effects.
- Do not use nested cards or card grids for basic content.
- Do not use generic marketing phrases or personality-test language.
- Do not hide the wealth table or sources on mobile.
- Do not use hover as the only interaction state.
- Do not add additional accent colors without a semantic reason.
