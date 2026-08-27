export const ROUTE_TYPES = Object.freeze([
  'four-year-college',
  'community-college',
  'apprenticeship',
  'active-duty-military',
  'guard-reserve',
  'rotc',
  'direct-work',
  'structured-service-gap'
]);

export const RELATIONSHIP_TYPES = Object.freeze([
  'direct',
  'strong',
  'adjacent',
  'exploratory'
]);

export const DATA_STATUS = Object.freeze([
  'established',
  'expanding',
  'committed-emerging',
  'speculative'
]);

// Route dimensions describe the bargain represented by a post-high-school route.
// Higher numbers always mean “more of the named attribute,” never “better.”
export const ROUTE_DIMENSIONS = Object.freeze({
  costBurden: { label: 'Up-front education / training cost burden', polarity: 'more' },
  timeToIncome: { label: 'Time before meaningful full-time income', polarity: 'more' },
  earnWhileLearning: { label: 'Earn-while-learning potential', polarity: 'more' },
  locationControl: { label: 'Control over where you live / train', polarity: 'more' },
  serviceObligation: { label: 'Contractual / service obligation', polarity: 'more' },
  credentialSpecificity: { label: 'Specificity of the first occupational credential', polarity: 'more' }
});

// These are independent facts/preferences, not a hidden universal quality score.
// Higher numbers always mean “more of the named attribute,” not “better.”
export const OCCUPATION_DIMENSIONS = Object.freeze({
  earlyIncome: { label: 'Early income potential', polarity: 'more' },
  matureIncome: { label: 'Mature income potential', polarity: 'more' },
  entryReliability: { label: 'Entry reliability', polarity: 'more' },
  marketDepth: { label: 'Labor-market depth', polarity: 'more' },
  localStrength: { label: 'Central NC market strength', polarity: 'more' },
  credentialMoat: { label: 'Credential / technical moat', polarity: 'more' },
  educationCost: { label: 'Education cost burden', polarity: 'more' },
  timeToIncome: { label: 'Time before full-time income', polarity: 'more' },
  earnWhileTraining: { label: 'Earn-while-training potential', polarity: 'more' },
  remotePotential: { label: 'Remote / location-flexible potential', polarity: 'more' },
  humanContact: { label: 'Human / customer / patient contact', polarity: 'more' },
  physicalIntensity: { label: 'Physical intensity', polarity: 'more' },
  acutePressure: { label: 'Acute / emergency pressure', polarity: 'more' },
  scheduleBurden: { label: 'Nights / shifts / on-call burden', polarity: 'more' },
  geographicPortability: { label: 'Geographic portability', polarity: 'more' },
  automationResilience: { label: 'Automation resilience / complementarity', polarity: 'more' },
  exitOptions: { label: 'Adjacent career / exit-option density', polarity: 'more' },
  selfEmployment: { label: 'Self-employment potential', polarity: 'more' },
  serviceObligation: { label: 'Contractual service obligation', polarity: 'more' }
});

export function blankDimensions(overrides = {}) {
  return Object.fromEntries(
    Object.keys(OCCUPATION_DIMENSIONS).map(key => [key, overrides[key] ?? null])
  );
}

export function source(id, title, url, asOf, kind = 'authoritative') {
  return { id, title, url, asOf, kind };
}

export function occupationRef(id, relationship = 'direct', note = '') {
  return { id, relationship, note };
}

export function clampScore(value) {
  if (value == null) return null;
  return Math.max(0, Math.min(100, Number(value)));
}
