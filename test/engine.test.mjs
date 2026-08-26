import test from 'node:test';
import assert from 'node:assert/strict';
import { CAREERS } from '../src/data.js';
import { initialProfile, applyEffects, rankCareers, simulateCareer, scoreCareer, profileSignal } from '../src/engine.js';

test('effects clamp profile values',()=>{
  const p=applyEffects(initialProfile(),{earlyEarnings:80,deskPreference:-90});
  assert.equal(p.earlyEarnings,100);
  assert.equal(p.deskPreference,0);
});

test('career score stays in 0..100',()=>{
  const p=initialProfile();
  for(const c of CAREERS){ const s=scoreCareer(p,c); assert.ok(s>=0 && s<=100); }
});

test('strong early-income low-school profile favors short pathways over advanced anesthesia',()=>{
  let p=initialProfile();
  p={...p,earlyEarnings:100,affordability:100,schoolTolerance:10,incomeCeiling:55,patientContact:70,handsOnTech:85,scienceTolerance:60};
  const ranked=rankCareers(p);
  const son=ranked.findIndex(c=>c.id==='sonography');
  const caa=ranked.findIndex(c=>c.id==='caa');
  const crna=ranked.findIndex(c=>c.id==='crna');
  assert.ok(son < caa);
  assert.ok(son < crna);
});

test('high school tolerance / ceiling / stakes profile allows advanced anesthesia to rise',()=>{
  let p=initialProfile();
  p={...p,earlyEarnings:25,affordability:35,schoolTolerance:100,incomeCeiling:100,patientContact:70,handsOnTech:85,scienceTolerance:95,highStakesTolerance:100,schedulePredictability:35};
  const top5=rankCareers(p).slice(0,5).map(c=>c.id);
  assert.ok(top5.includes('crna') || top5.includes('caa'));
});

test('neutral profile has zero preference signal',()=>{
  assert.equal(profileSignal(initialProfile()),0);
});

test('wealth simulation produces all ages and finite values',()=>{
  const son=CAREERS.find(c=>c.id==='sonography');
  const rows=simulateCareer(son,{});
  assert.equal(rows[0].age,18);
  assert.equal(rows.at(-1).age,35);
  assert.ok(rows.every(r=>Number.isFinite(r.netWorth)));
});
