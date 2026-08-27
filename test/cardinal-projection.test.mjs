import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildDecisionProfileFromAnswers,
  applyTuesdayAnswers,
  evaluateCardinal,
  projectPrograms
} from '../src/cardinal/index.js';

test('Ordinary Tuesday answers refine rather than erase hard limits',()=>{
  const base=buildDecisionProfileFromAnswers({
    'routes-open':'all',
    'human-contact':'hard-low',
    'remote':'important'
  });
  const refined=applyTuesdayAnswers(base,{
    'tuesday-work-surface':'screen',
    'tuesday-environment':'flexible'
  });
  assert.equal(refined.occupationLimits.humanContact.max,25);
  assert.ok(refined.occupationPreferences.remotePotential.weight>base.occupationPreferences.remotePotential.weight);
});

test('program projection never revives an occupation eliminated by a hard veto',()=>{
  const profile=buildDecisionProfileFromAnswers({
    'routes-open':['community-college','four-year-college','apprenticeship'],
    'physical-work':'hard-low',
    'remote':'important',
    'entry-certainty':'important'
  });
  const evaluation=evaluateCardinal(profile);
  const eliminated=new Set(evaluation.occupations.eliminated.map(x=>x.id));
  const programs=projectPrograms(evaluation,{limit:50});
  for(const program of programs){
    for(const link of program.occupationLinks){
      assert.equal(eliminated.has(link.occupationId),false,`${program.id} revived ${link.occupationId}`);
    }
  }
});

test('program projection respects route types the student declined',()=>{
  const profile=buildDecisionProfileFromAnswers({
    'routes-open':['four-year-college'],
    'income-ceiling':'maximize',
    'entry-certainty':'important'
  });
  const programs=projectPrograms(evaluateCardinal(profile),{limit:50});
  assert.ok(programs.length>0);
  assert.ok(programs.every(p=>p.routeType==='four-year-college'));
});
