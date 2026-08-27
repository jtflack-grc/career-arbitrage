import test from 'node:test';
import assert from 'node:assert/strict';

import {
  OCCUPATION_DIMENSIONS,
  OCCUPATIONS,
  PROGRAMS,
  ROUTES,
  validateCardinalData
} from '../src/cardinal/index.js';

test('Cardinal dataset validates cleanly', () => {
  assert.deepEqual(validateCardinalData(), []);
});

test('every occupation has the complete preference-dimension vector', () => {
  const expected = Object.keys(OCCUPATION_DIMENSIONS).sort();
  for (const occupation of OCCUPATIONS) {
    assert.deepEqual(Object.keys(occupation.dimensions).sort(), expected, occupation.id);
  }
});

test('no record contains a universal career-quality score', () => {
  const forbidden = ['score','qualityScore','careerQuality','prestigeScore','successScore'];
  for (const record of [...OCCUPATIONS, ...PROGRAMS, ...ROUTES]) {
    for (const key of forbidden) assert.equal(key in record, false, `${record.id} contains ${key}`);
  }
});

test('defined credential and broad-degree examples preserve different on-ramp clarity', () => {
  const aviation = PROGRAMS.find(x => x.id === 'gtcc-aviation-systems-aas');
  const isscm = PROGRAMS.find(x => x.id === 'uncg-isscm-bs');
  const transfer = PROGRAMS.find(x => x.id === 'gtcc-aa-transfer');
  assert.equal(aviation.onRampClarity, 5);
  assert.equal(isscm.onRampClarity, 3);
  assert.equal(transfer.onRampClarity, 1);
});

test('route universe includes college, apprenticeship, military, direct work and service', () => {
  const types = new Set(ROUTES.map(x => x.type));
  for (const required of ['four-year-college','community-college','apprenticeship','active-duty-military','guard-reserve','rotc','direct-work','structured-service-gap']) {
    assert.ok(types.has(required), `missing ${required}`);
  }
});

test('remote potential is an attribute, not an automatic preference', () => {
  const software = OCCUPATIONS.find(x => x.id === 'software-developer');
  const electrician = OCCUPATIONS.find(x => x.id === 'electrician');
  assert.ok(software.dimensions.remotePotential > electrician.dimensions.remotePotential);
  assert.ok(electrician.dimensions.entryReliability > software.dimensions.entryReliability);
});
