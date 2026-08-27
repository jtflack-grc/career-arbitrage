import test from 'node:test';
import assert from 'node:assert/strict';

import { evaluateCardinal } from '../src/cardinal/decision-engine.js';
import { buildDecisionProfileFromAnswers, describeSieveAnswers } from '../src/cardinal/sieve.js';

const byId = (rows,id) => rows.find(row=>row.id===id);

test('route multiselect preserves only the route families a student keeps open', () => {
  const profile=buildDecisionProfileFromAnswers({'routes-open':['four-year-college','apprenticeship']});
  assert.deepEqual(profile.allowedRouteTypes.sort(),['apprenticeship','four-year-college']);
});

test('soft remote preference ranks without eliminating onsite work', () => {
  const profile=buildDecisionProfileFromAnswers({remote:'important'});
  const result=evaluateCardinal(profile);
  assert.ok(byId(result.occupations.surviving,'electrician'));
  assert.ok(byId(result.occupations.surviving,'software-developer').score > byId(result.occupations.surviving,'electrician').score);
});

test('explicit remote requirement becomes a real hard limit', () => {
  const profile=buildDecisionProfileFromAnswers({remote:'required'});
  const result=evaluateCardinal(profile);
  assert.ok(result.occupations.eliminated.some(x=>x.id==='electrician'));
  assert.ok(result.occupations.surviving.some(x=>x.id==='software-developer'));
});

test('human-contact hard no removes bedside work while preserving low-contact technical work', () => {
  const profile=buildDecisionProfileFromAnswers({'human-contact':'hard-low'});
  const result=evaluateCardinal(profile);
  assert.ok(result.occupations.eliminated.some(x=>x.id==='registered-nurse'));
  assert.ok(result.occupations.surviving.some(x=>x.id==='clinical-lab-technologist'));
});

test('low-cost fast-income earn-while-learning answers reward FAME economics', () => {
  const profile=buildDecisionProfileFromAnswers({
    'cost-pressure':'critical',
    'income-speed':'now',
    'earn-while-learning':'critical',
    'entry-certainty':'critical'
  });
  const result=evaluateCardinal(profile);
  const fame=byId(result.routes.surviving,'fame-advanced-manufacturing');
  const residential=byId(result.routes.surviving,'public-four-year-residential');
  assert.ok(fame.score > residential.score);
});

test('hard obligation answer can remove active-duty and ROTC without moralizing about service', () => {
  const profile=buildDecisionProfileFromAnswers({'structured-obligation':'hard-no'});
  const result=evaluateCardinal(profile);
  assert.ok(result.routes.eliminated.some(x=>x.id==='active-duty-technical-service'));
  assert.ok(result.routes.eliminated.some(x=>x.id==='rotc-officer'));
  assert.ok(result.routes.surviving.some(x=>x.id==='public-four-year-commuter'));
});

test('sieve descriptions can be rendered back to a counselor/student as an answer trace', () => {
  const trace=describeSieveAnswers({
    'routes-open':['community-college','apprenticeship','active-duty-military'],
    remote:'nice',
    'income-ceiling':'maximize'
  });
  assert.equal(trace.length,3);
  assert.match(trace[0].answer,/Community college/);
  assert.match(trace[0].answer,/Active-duty military service/);
  assert.match(trace[2].answer,/substantial long-term upside/i);
});

test('unknown sieve answer fails loudly', () => {
  assert.throws(()=>buildDecisionProfileFromAnswers({remote:'teleport'}),/Unknown answer/);
});
