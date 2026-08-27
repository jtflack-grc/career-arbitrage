import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createDecisionProfile,
  evaluateCardinal,
  evaluateOccupations,
  evaluateRoutes,
  compareCandidates
} from '../src/cardinal/decision-engine.js';

const byId = (rows,id) => rows.find(row => row.id === id);

test('route selection removes only route types the student explicitly excludes', () => {
  const result=evaluateRoutes({allowedRouteTypes:['apprenticeship','community-college']});
  assert.ok(result.surviving.some(x=>x.type==='apprenticeship'));
  assert.ok(result.surviving.some(x=>x.type==='community-college'));
  assert.ok(result.eliminated.some(x=>x.type==='four-year-college' && x.reasons[0].type==='route-not-selected'));
  assert.ok(result.eliminated.some(x=>x.type==='active-duty-military' && x.reasons[0].type==='route-not-selected'));
});

test('hard occupation vetoes eliminate candidates rather than merely lowering a score', () => {
  const result=evaluateOccupations({occupationLimits:{humanContact:{max:20}}});
  assert.ok(result.eliminated.some(x=>x.id==='registered-nurse'));
  assert.ok(result.surviving.some(x=>x.id==='software-developer'));
  const rn=byId(result.eliminated,'registered-nurse');
  assert.equal(rn.reasons[0].key,'humanContact');
});

test('ordinary preferences rank survivors but do not eliminate mismatches', () => {
  const result=evaluateOccupations({
    occupationPreferences:{
      remotePotential:{target:100,weight:5},
      matureIncome:{target:100,weight:3},
      humanContact:{target:0,weight:3},
      physicalIntensity:{target:0,weight:2}
    }
  });
  assert.equal(result.eliminated.length,0);
  const software=byId(result.surviving,'software-developer');
  const electrician=byId(result.surviving,'electrician');
  assert.ok(software.score > electrician.score);
});

test('earn-while-learning and low-cost preferences can favor apprenticeship economics without grading on prestige', () => {
  const result=evaluateRoutes({
    routePreferences:{
      costBurden:{target:0,weight:4},
      timeToIncome:{target:0,weight:4},
      earnWhileLearning:{target:100,weight:5},
      credentialSpecificity:{target:100,weight:2}
    }
  });
  const fame=byId(result.surviving,'fame-advanced-manufacturing');
  const residential=byId(result.surviving,'public-four-year-residential');
  assert.ok(fame.score > residential.score);
});

test('strong location-control preference does not automatically eliminate military service', () => {
  const result=evaluateRoutes({routePreferences:{locationControl:{target:100,weight:10}}});
  const active=byId(result.surviving,'active-duty-technical-service');
  assert.ok(active);
  assert.ok(active.score < byId(result.surviving,'community-college-transfer').score);
});

test('explicit service-obligation maximum can eliminate military and other commitment-heavy routes', () => {
  const result=evaluateRoutes({routeLimits:{serviceObligation:{max:50}}});
  assert.ok(result.eliminated.some(x=>x.id==='active-duty-technical-service'));
  assert.ok(result.eliminated.some(x=>x.id==='rotc-officer'));
  assert.ok(result.surviving.some(x=>x.id==='public-four-year-commuter'));
});

test('profile rejects unknown dimensions instead of silently ignoring them', () => {
  assert.throws(()=>createDecisionProfile({occupationPreferences:{prestige:{target:100,weight:10}}}),/Unknown occupationPreferences dimension/);
  assert.throws(()=>createDecisionProfile({allowedRouteTypes:['magic-college']}),/Unknown route type/);
});

test('evaluation exposes what explicit constraints removed', () => {
  const result=evaluateCardinal({
    allowedRouteTypes:['four-year-college','community-college'],
    occupationLimits:{humanContact:{max:20},acutePressure:{max:50}}
  });
  assert.ok(result.tradeoffSummary.routesEliminated > 0);
  assert.ok(result.tradeoffSummary.occupationsEliminated > 0);
  assert.ok(result.tradeoffSummary.occupationReasons.some(x=>x.reason.key==='humanContact'));
});

test('candidate comparison describes compatibility rather than universal quality', () => {
  const result=evaluateOccupations({occupationPreferences:{remotePotential:{target:100,weight:1}}});
  const software=byId(result.surviving,'software-developer');
  const electrician=byId(result.surviving,'electrician');
  const comparison=compareCandidates(software,electrician);
  assert.equal(comparison.winner,'software-developer');
  assert.match(comparison.note,/compatibility, not universal quality/);
});
