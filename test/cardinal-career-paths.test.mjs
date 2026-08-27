import test from 'node:test';
import assert from 'node:assert/strict';

import {
  OCCUPATIONS,
  OCCUPATION_BY_ID,
  projectCareerPaths,
  careerEducationRuleCoverage
} from '../src/cardinal/index.js';

function fakeEvaluation(occupationId,allowedRouteTypes=['community-college']){
  const occupation=OCCUPATION_BY_ID[occupationId];
  if(!occupation) throw new Error(`Unknown occupation ${occupationId}`);
  return {
    profile:{allowedRouteTypes},
    routes:{surviving:allowedRouteTypes.map(type=>({type}))},
    occupations:{surviving:[{
      id:occupation.id,
      name:occupation.name,
      score:92,
      coverage:100,
      strengths:[],
      frictions:[],
      occupation
    }]}
  };
}

const analysisHeavyInterest={
  answered:7,
  scores:{build:0,analyze:100,create:0,help:20,lead:20,organize:100,communicate:20},
  top:[]
};

test('every canonical occupation has an explicit career-education rule',()=>{
  assert.equal(careerEducationRuleCoverage(),OCCUPATIONS.length);
});

test('police officer education paths never backfill accounting even with organize/analyze interests',()=>{
  const [group]=projectCareerPaths(fakeEvaluation('police-patrol-officer'),analysisHeavyInterest,{maxPathsPerOccupation:20});
  assert.ok(group.paths.length>0,'expected at least one police education/training path');
  assert.ok(group.paths.some(path=>/BLET|law enforcement|criminal justice/i.test(path.name)),'expected BLET/law-enforcement/criminal-justice path');
  assert.ok(group.paths.every(path=>!/accounting|finance|business administration/i.test(path.name)),`unexpected police path: ${group.paths.map(x=>x.name).join(', ')}`);
  assert.ok(group.paths.every(path=>path.routeType==='community-college'));
});

test('accountant paths stay in accounting rather than inheriting unrelated business majors',()=>{
  const [group]=projectCareerPaths(fakeEvaluation('accountant-auditor',['community-college','four-year-college']),analysisHeavyInterest,{maxPathsPerOccupation:20});
  assert.ok(group.paths.length>0);
  assert.ok(group.paths.every(path=>/account/i.test(path.name)),`unexpected accounting path: ${group.paths.map(x=>x.name).join(', ')}`);
});

test('direct-work police route can surface an agency-sponsored law-enforcement bridge',()=>{
  const [group]=projectCareerPaths(fakeEvaluation('police-patrol-officer',['direct-work']),analysisHeavyInterest,{maxPathsPerOccupation:10});
  assert.ok(group.paths.length>0);
  assert.ok(group.paths.every(path=>path.routeType==='direct-work'));
  assert.ok(group.paths.some(path=>/BLET|law enforcement|agency/i.test(path.name)));
});

test('career projector does not use interest-only fallback when no career rule matches an option',()=>{
  const [group]=projectCareerPaths(fakeEvaluation('heavy-truck-driver',['four-year-college']),analysisHeavyInterest,{maxPathsPerOccupation:20});
  assert.equal(group.paths.length,0,'a four-year accounting/analytics degree must not be invented as a truck-driver path');
});
