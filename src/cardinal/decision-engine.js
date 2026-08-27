import { OCCUPATIONS } from './occupations.js';
import { ROUTES } from './routes.js';
import { OCCUPATION_DIMENSIONS, ROUTE_DIMENSIONS, ROUTE_TYPES, clampScore } from './schema.js';

const round = value => Math.round(value);
const isFiniteNumber = value => Number.isFinite(Number(value));

function assertKnownKeys(record, definitions, label) {
  for (const key of Object.keys(record || {})) {
    if (!(key in definitions)) throw new Error(`Unknown ${label} dimension: ${key}`);
  }
}

function normalizePreference(value, label) {
  if (value == null) return null;
  const raw = typeof value === 'number' ? { target:value, weight:1 } : value;
  if (!isFiniteNumber(raw.target)) throw new Error(`${label} preference requires a numeric target`);
  if (!isFiniteNumber(raw.weight ?? 1) || Number(raw.weight ?? 1) < 0) throw new Error(`${label} preference weight must be >= 0`);
  return { target:clampScore(raw.target), weight:Number(raw.weight ?? 1) };
}

function normalizeLimit(value, label) {
  if (value == null) return null;
  if (typeof value !== 'object') throw new Error(`${label} limit must be an object with min and/or max`);
  const normalized = {};
  if (value.min != null) {
    if (!isFiniteNumber(value.min)) throw new Error(`${label} minimum must be numeric`);
    normalized.min = clampScore(value.min);
  }
  if (value.max != null) {
    if (!isFiniteNumber(value.max)) throw new Error(`${label} maximum must be numeric`);
    normalized.max = clampScore(value.max);
  }
  if (normalized.min == null && normalized.max == null) throw new Error(`${label} limit requires min and/or max`);
  if (normalized.min != null && normalized.max != null && normalized.min > normalized.max) {
    throw new Error(`${label} minimum cannot exceed maximum`);
  }
  return normalized;
}

function normalizePreferenceMap(record = {}, definitions, label) {
  assertKnownKeys(record, definitions, label);
  return Object.fromEntries(
    Object.entries(record)
      .map(([key,value]) => [key,normalizePreference(value,`${label}.${key}`)])
      .filter(([,value]) => value && value.weight > 0)
  );
}

function normalizeLimitMap(record = {}, definitions, label) {
  assertKnownKeys(record, definitions, label);
  return Object.fromEntries(
    Object.entries(record)
      .map(([key,value]) => [key,normalizeLimit(value,`${label}.${key}`)])
      .filter(([,value]) => value)
  );
}

export function createDecisionProfile(input = {}) {
  const allowedRouteTypes = input.allowedRouteTypes == null
    ? [...ROUTE_TYPES]
    : [...new Set(input.allowedRouteTypes)];

  for (const routeType of allowedRouteTypes) {
    if (!ROUTE_TYPES.includes(routeType)) throw new Error(`Unknown route type: ${routeType}`);
  }

  return {
    allowedRouteTypes,
    routePreferences:normalizePreferenceMap(input.routePreferences,ROUTE_DIMENSIONS,'routePreferences'),
    occupationPreferences:normalizePreferenceMap(input.occupationPreferences,OCCUPATION_DIMENSIONS,'occupationPreferences'),
    routeLimits:normalizeLimitMap(input.routeLimits,ROUTE_DIMENSIONS,'routeLimits'),
    occupationLimits:normalizeLimitMap(input.occupationLimits,OCCUPATION_DIMENSIONS,'occupationLimits')
  };
}

function scoreVector(vector, preferences, definitions) {
  const rows=[];
  const unknown=[];
  let totalWeight=0;
  let knownWeight=0;
  let earned=0;

  for (const [key,pref] of Object.entries(preferences)) {
    totalWeight += pref.weight;
    const value=vector?.[key];
    if (!isFiniteNumber(value)) {
      unknown.push({key,label:definitions[key].label,target:pref.target,weight:pref.weight});
      continue;
    }
    const numeric=clampScore(value);
    const distance=Math.abs(numeric-pref.target);
    const closeness=1-(distance/100);
    const weightedCloseness=closeness*pref.weight;
    knownWeight += pref.weight;
    earned += weightedCloseness;
    rows.push({
      key,
      label:definitions[key].label,
      value:numeric,
      target:pref.target,
      weight:pref.weight,
      distance:round(distance),
      closeness:round(closeness*100),
      impact:weightedCloseness
    });
  }

  const score=knownWeight > 0 ? round((earned/knownWeight)*100) : null;
  const coverage=totalWeight > 0 ? round((knownWeight/totalWeight)*100) : 0;
  const strengths=[...rows].sort((a,b)=>(b.closeness*b.weight)-(a.closeness*a.weight));
  const frictions=[...rows].sort((a,b)=>(b.distance*b.weight)-(a.distance*a.weight));
  return {score,coverage,strengths,frictions,unknownPreferences:unknown};
}

function evaluateLimits(vector, limits, definitions) {
  const reasons=[];
  const unknown=[];
  for (const [key,limit] of Object.entries(limits)) {
    const value=vector?.[key];
    if (!isFiniteNumber(value)) {
      unknown.push({key,label:definitions[key].label,limit});
      continue;
    }
    const numeric=clampScore(value);
    if (limit.min != null && numeric < limit.min) {
      reasons.push({
        type:'hard-limit',key,label:definitions[key].label,value:numeric,
        rule:'min',threshold:limit.min,
        message:`${definitions[key].label} is ${numeric}, below your minimum of ${limit.min}.`
      });
    }
    if (limit.max != null && numeric > limit.max) {
      reasons.push({
        type:'hard-limit',key,label:definitions[key].label,value:numeric,
        rule:'max',threshold:limit.max,
        message:`${definitions[key].label} is ${numeric}, above your maximum of ${limit.max}.`
      });
    }
  }
  return {reasons,unknown};
}

function sortEvaluations(rows) {
  return [...rows].sort((a,b) => {
    if (a.score == null && b.score == null) return a.name.localeCompare(b.name);
    if (a.score == null) return 1;
    if (b.score == null) return -1;
    return b.score-a.score || b.coverage-a.coverage || a.name.localeCompare(b.name);
  });
}

export function evaluateRoutes(profileInput = {}) {
  const profile=createDecisionProfile(profileInput);
  const allowed=new Set(profile.allowedRouteTypes);
  const surviving=[];
  const eliminated=[];

  for (const route of ROUTES) {
    if (!allowed.has(route.type)) {
      eliminated.push({
        id:route.id,name:route.name,type:route.type,
        reasons:[{type:'route-not-selected',message:`${route.type} was not selected as a route to investigate.`}],
        unknownLimits:[]
      });
      continue;
    }

    const limits=evaluateLimits(route.tradeoffs,profile.routeLimits,ROUTE_DIMENSIONS);
    if (limits.reasons.length) {
      eliminated.push({id:route.id,name:route.name,type:route.type,reasons:limits.reasons,unknownLimits:limits.unknown});
      continue;
    }

    const match=scoreVector(route.tradeoffs,profile.routePreferences,ROUTE_DIMENSIONS);
    surviving.push({
      id:route.id,name:route.name,type:route.type,description:route.description,
      score:match.score,coverage:match.coverage,
      strengths:match.strengths.slice(0,3),frictions:match.frictions.slice(0,3),
      unknownPreferences:match.unknownPreferences,unknownLimits:limits.unknown,
      route
    });
  }

  return {profile,surviving:sortEvaluations(surviving),eliminated};
}

export function evaluateOccupations(profileInput = {}) {
  const profile=createDecisionProfile(profileInput);
  const surviving=[];
  const eliminated=[];

  for (const occupation of OCCUPATIONS) {
    const limits=evaluateLimits(occupation.dimensions,profile.occupationLimits,OCCUPATION_DIMENSIONS);
    if (limits.reasons.length) {
      eliminated.push({id:occupation.id,name:occupation.name,family:occupation.family,reasons:limits.reasons,unknownLimits:limits.unknown});
      continue;
    }

    const match=scoreVector(occupation.dimensions,profile.occupationPreferences,OCCUPATION_DIMENSIONS);
    surviving.push({
      id:occupation.id,name:occupation.name,family:occupation.family,soc:occupation.soc,
      score:match.score,coverage:match.coverage,
      strengths:match.strengths.slice(0,4),frictions:match.frictions.slice(0,4),
      unknownPreferences:match.unknownPreferences,unknownLimits:limits.unknown,
      occupation
    });
  }

  return {profile,surviving:sortEvaluations(surviving),eliminated};
}

function summarizeEliminations(rows, maxExamples=5) {
  const byReason=new Map();
  for (const row of rows) {
    for (const reason of row.reasons) {
      const key=reason.type === 'hard-limit' ? `${reason.type}:${reason.key}:${reason.rule}:${reason.threshold}` : reason.type;
      if (!byReason.has(key)) byReason.set(key,{reason,count:0,examples:[]});
      const entry=byReason.get(key);
      entry.count++;
      if (entry.examples.length < maxExamples) entry.examples.push({id:row.id,name:row.name});
    }
  }
  return [...byReason.values()].sort((a,b)=>b.count-a.count);
}

export function evaluateCardinal(profileInput = {}) {
  const profile=createDecisionProfile(profileInput);
  const routes=evaluateRoutes(profile);
  const occupations=evaluateOccupations(profile);
  return {
    profile,
    routes,
    occupations,
    tradeoffSummary:{
      routesEliminated:routes.eliminated.length,
      occupationsEliminated:occupations.eliminated.length,
      routeReasons:summarizeEliminations(routes.eliminated),
      occupationReasons:summarizeEliminations(occupations.eliminated)
    }
  };
}

export function compareCandidates(a,b) {
  if (a.score == null || b.score == null) return null;
  const delta=a.score-b.score;
  return {
    winner:delta === 0 ? null : (delta > 0 ? a.id : b.id),
    delta:Math.abs(delta),
    note:delta === 0 ? 'These candidates match the stated preferences equally at current evidence coverage.' : `${delta > 0 ? a.name : b.name} is ${Math.abs(delta)} points closer to the stated preferences; this is compatibility, not universal quality.`
  };
}
