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

test('active-duty-only playthrough cannot leak four-year college programs',()=>{
  const profile=buildDecisionProfileFromAnswers({
    'routes-open':['active-duty-military'],
    'structured-obligation':'comfortable',
    'earn-while-learning':'critical',
    'location-control':'mobile',
    'entry-certainty':'important'
  });
  const evaluation=evaluateCardinal(profile);
  const visible=evaluation.occupations.surviving.slice(0,6).map(row=>row.id);
  const programs=projectPrograms(evaluation,{limit:20,occupationIds:visible});
  assert.ok(programs.length>0,'active-duty route should have modeled service bridges');
  assert.ok(programs.every(p=>p.routeType==='active-duty-military'));
  assert.equal(programs.some(p=>p.routeType==='four-year-college'),false);
});

test('police recommendation projects to BLET instead of unrelated degrees when community college is open',()=>{
  const profile=buildDecisionProfileFromAnswers({
    'routes-open':['community-college'],
    'entry-certainty':'critical',
    'market-depth':'local'
  });
  const evaluation=evaluateCardinal(profile);
  const police=evaluation.occupations.surviving.find(row=>row.id==='police-patrol-officer');
  assert.ok(police,'police occupation should survive this profile');
  evaluation.occupations.surviving=[police];
  const programs=projectPrograms(evaluation,{limit:10,occupationIds:['police-patrol-officer']});
  assert.ok(programs.length>0);
  assert.equal(programs[0].id,'gtcc-blet');
  assert.ok(programs.every(p=>p.routeType==='community-college'));
  assert.equal(programs.some(p=>p.id==='uncg-accounting-bs'),false);
});

test('direct-work police recommendation can surface an agency-hired BLET bridge',()=>{
  const profile=buildDecisionProfileFromAnswers({
    'routes-open':['direct-work'],
    'entry-certainty':'critical',
    'market-depth':'local'
  });
  const evaluation=evaluateCardinal(profile);
  const police=evaluation.occupations.surviving.find(row=>row.id==='police-patrol-officer');
  assert.ok(police);
  evaluation.occupations.surviving=[police];
  const programs=projectPrograms(evaluation,{limit:10,occupationIds:['police-patrol-officer']});
  assert.equal(programs[0]?.id,'agency-hired-blet');
  assert.ok(programs.every(p=>p.routeType==='direct-work'));
});

test('visible occupation projection does not backfill unrelated gateway programs',()=>{
  const profile=buildDecisionProfileFromAnswers({
    'routes-open':['four-year-college'],
    'income-ceiling':'maximize'
  });
  const evaluation=evaluateCardinal(profile);
  const police=evaluation.occupations.surviving.find(row=>row.id==='police-patrol-officer');
  assert.ok(police);
  evaluation.occupations.surviving=[police];
  const programs=projectPrograms(evaluation,{limit:10,occupationIds:['police-patrol-officer']});
  assert.deepEqual(programs,[],'no matching four-year police bridge should be replaced with unrelated degrees');
});
