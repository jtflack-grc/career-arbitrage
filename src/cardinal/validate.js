import { ROUTE_TYPES, RELATIONSHIP_TYPES, DATA_STATUS, OCCUPATION_DIMENSIONS } from './schema.js';
import { SOURCES } from './sources.js';
import { CLUSTERS } from './clusters.js';
import { OCCUPATIONS } from './occupations.js';
import { PROGRAMS } from './programs.js';
import { ROUTES } from './routes.js';

const forbiddenScoreFields = new Set(['score','qualityScore','careerQuality','prestigeScore','successScore']);

function duplicateIds(items, label, errors) {
  const seen = new Set();
  for (const item of items) {
    if (!item?.id) errors.push(`${label}: missing id`);
    else if (seen.has(item.id)) errors.push(`${label}: duplicate id ${item.id}`);
    else seen.add(item.id);
  }
}

function checkForbiddenFields(item, label, errors) {
  for (const key of Object.keys(item || {})) {
    if (forbiddenScoreFields.has(key)) errors.push(`${label} ${item.id}: forbidden universal score field ${key}`);
  }
}

function checkSourceIds(item, sourceIds, label, errors) {
  for (const sourceId of item.sourceIds || []) {
    if (!sourceIds.has(sourceId)) errors.push(`${label} ${item.id}: unknown source ${sourceId}`);
  }
}

function checkClusterIds(item, clusterIds, label, errors) {
  for (const clusterId of item.clusterIds || []) {
    if (!clusterIds.has(clusterId)) errors.push(`${label} ${item.id}: unknown cluster ${clusterId}`);
  }
}

function checkOccupationRefs(item, occupationIds, label, errors) {
  for (const ref of item.occupationRefs || []) {
    if (!occupationIds.has(ref.id)) errors.push(`${label} ${item.id}: unknown occupation ${ref.id}`);
    if (!RELATIONSHIP_TYPES.includes(ref.relationship)) errors.push(`${label} ${item.id}: invalid relationship ${ref.relationship}`);
  }
}

export function validateCardinalData() {
  const errors = [];
  duplicateIds(SOURCES, 'source', errors);
  duplicateIds(CLUSTERS, 'cluster', errors);
  duplicateIds(OCCUPATIONS, 'occupation', errors);
  duplicateIds(PROGRAMS, 'program', errors);
  duplicateIds(ROUTES, 'route', errors);

  const sourceIds = new Set(SOURCES.map(x => x.id));
  const clusterIds = new Set(CLUSTERS.map(x => x.id));
  const occupationIds = new Set(OCCUPATIONS.map(x => x.id));

  for (const item of SOURCES) {
    if (!/^https:\/\//.test(item.url || '')) errors.push(`source ${item.id}: source URL must be https`);
    if (!item.asOf) errors.push(`source ${item.id}: missing asOf date/snapshot`);
  }

  for (const item of CLUSTERS) {
    checkForbiddenFields(item, 'cluster', errors);
    checkSourceIds(item, sourceIds, 'cluster', errors);
    if (!DATA_STATUS.includes(item.status)) errors.push(`cluster ${item.id}: invalid status ${item.status}`);
  }

  for (const item of OCCUPATIONS) {
    checkForbiddenFields(item, 'occupation', errors);
    checkSourceIds(item, sourceIds, 'occupation', errors);
    checkClusterIds(item, clusterIds, 'occupation', errors);
    if (!/^\d{2}-\d{4}$/.test(item.soc || '')) errors.push(`occupation ${item.id}: invalid SOC ${item.soc}`);
    const expected = Object.keys(OCCUPATION_DIMENSIONS);
    const actual = Object.keys(item.dimensions || {});
    for (const key of expected) {
      if (!actual.includes(key)) errors.push(`occupation ${item.id}: missing dimension ${key}`);
      const value = item.dimensions?.[key];
      if (value != null && (!Number.isFinite(value) || value < 0 || value > 100)) {
        errors.push(`occupation ${item.id}: dimension ${key} outside 0-100`);
      }
    }
  }

  for (const item of PROGRAMS) {
    checkForbiddenFields(item, 'program', errors);
    checkSourceIds(item, sourceIds, 'program', errors);
    checkClusterIds(item, clusterIds, 'program', errors);
    checkOccupationRefs(item, occupationIds, 'program', errors);
    if (!ROUTE_TYPES.includes(item.routeType)) errors.push(`program ${item.id}: invalid routeType ${item.routeType}`);
    if (!Number.isInteger(item.onRampClarity) || item.onRampClarity < 1 || item.onRampClarity > 5) {
      errors.push(`program ${item.id}: onRampClarity must be integer 1-5`);
    }
  }

  for (const item of ROUTES) {
    checkForbiddenFields(item, 'route', errors);
    checkSourceIds(item, sourceIds, 'route', errors);
    checkOccupationRefs(item, occupationIds, 'route', errors);
    if (!ROUTE_TYPES.includes(item.type)) errors.push(`route ${item.id}: invalid type ${item.type}`);
    for (const [key,value] of Object.entries(item.tradeoffs || {})) {
      if (!Number.isFinite(value) || value < 0 || value > 100) errors.push(`route ${item.id}: tradeoff ${key} outside 0-100`);
    }
  }

  return errors;
}

export function assertCardinalData() {
  const errors = validateCardinalData();
  if (errors.length) throw new Error(`Cardinal data validation failed:\n${errors.map(x => `- ${x}`).join('\n')}`);
  return true;
}
