import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MILITARY_SPECIALTIES,EDUCATION_CATALOG,INTEREST_QUESTIONS,
  buildInterestProfile,buildDecisionProfileFromAnswers,evaluateCardinal,
  projectMilitarySpecialties,projectEducationOptions,validateCardinalData
} from '../src/cardinal/index.js';

test('wide-net catalogs validate cleanly',()=>{
  assert.deepEqual(validateCardinalData(),[]);
});

test('military inventory is broad and covers all six armed services',()=>{
  assert.ok(MILITARY_SPECIALTIES.length>=180,`expected >=180 military specialty records, got ${MILITARY_SPECIALTIES.length}`);
  const services=new Set(MILITARY_SPECIALTIES.map(x=>x.service));
  for(const service of ['Army','Air Force','Navy','Marine Corps','Coast Guard','Space Force']) assert.ok(services.has(service),`missing ${service}`);
});

test('Coast Guard catalog contains all 21 current enlisted ratings',()=>{
  const rows=MILITARY_SPECIALTIES.filter(x=>x.service==='Coast Guard'&&x.rankPath==='enlisted');
  assert.equal(rows.length,21);
  for(const row of rows){
    assert.ok(row.components.includes('active-duty'));
    assert.ok(row.components.includes('reserve'));
  }
});

test('Space Force catalog preserves seven enlisted and ten officer careers modeled',()=>{
  const rows=MILITARY_SPECIALTIES.filter(x=>x.service==='Space Force');
  assert.equal(rows.filter(x=>x.rankPath==='enlisted').length,7);
  assert.equal(rows.filter(x=>x.rankPath==='officer').length,10);
});

test('active-duty route does not surface officer-only specialties without ROTC',()=>{
  const profile=buildDecisionProfileFromAnswers({'routes-open':['active-duty-military']});
  const evaluation=evaluateCardinal(profile);
  const interest=buildInterestProfile({[INTEREST_QUESTIONS[0].id]:'fix-it'});
  const rows=projectMilitarySpecialties(evaluation,interest,{limit:300});
  assert.ok(rows.length>0);
  assert.ok(rows.every(x=>x.rankPath!=='officer'));
});

test('Guard Reserve route only surfaces specialties with a verified reserve or guard component',()=>{
  const profile=buildDecisionProfileFromAnswers({'routes-open':['guard-reserve']});
  const evaluation=evaluateCardinal(profile);
  const interest=buildInterestProfile({[INTEREST_QUESTIONS[0].id]:'find-cause'});
  const rows=projectMilitarySpecialties(evaluation,interest,{limit:300});
  assert.ok(rows.length>0);
  assert.ok(rows.every(x=>x.components.some(c=>['reserve','national-guard','air-force-reserve','air-national-guard'].includes(c))));
  assert.equal(rows.some(x=>x.service==='Space Force'),false);
});

test('ROTC route surfaces officer careers rather than enlisted ASVAB jobs',()=>{
  const profile=buildDecisionProfileFromAnswers({'routes-open':['rotc']});
  const evaluation=evaluateCardinal(profile);
  const interest=buildInterestProfile({[INTEREST_QUESTIONS[0].id]:'coordinate'});
  const rows=projectMilitarySpecialties(evaluation,interest,{limit:300});
  assert.ok(rows.length>0);
  assert.ok(rows.every(x=>x.rankPath==='officer'));
});

test('education net is intentionally broad across Triad and Central NC institutions',()=>{
  assert.ok(EDUCATION_CATALOG.length>=350,`expected >=350 education records, got ${EDUCATION_CATALOG.length}`);
  const institutions=new Set(EDUCATION_CATALOG.map(x=>x.institution));
  for(const school of ['GTCC','Forsyth Tech','Davidson-Davie CC','Randolph CC','Alamance CC','Rockingham CC','Surry CC','NC A&T','UNCG','WSSU','UNC Charlotte','Elon University','Guilford College','High Point University','Wake Forest University','NC State']) assert.ok(institutions.has(school),`missing ${school}`);
});

test('education projector honors route choice and does not leak four-year options into community-college-only playthrough',()=>{
  const profile=buildDecisionProfileFromAnswers({'routes-open':['community-college']});
  const evaluation=evaluateCardinal(profile);
  const interest=buildInterestProfile({
    'interest-problem':'fix-it','interest-output':'tangible','interest-group':'technical','interest-mess':'machine'
  });
  const rows=projectEducationOptions(evaluation,interest,{limit:100});
  assert.ok(rows.length>0);
  assert.ok(rows.every(x=>x.routeType==='community-college'));
});

test('interest layer sorts rather than eliminates broad education options',()=>{
  const profile=buildDecisionProfileFromAnswers({'routes-open':['four-year-college','community-college']});
  const evaluation=evaluateCardinal(profile);
  const interest=buildInterestProfile({
    'interest-problem':'fix-it','interest-output':'tangible','interest-group':'technical','interest-mess':'machine','interest-create':'physical','interest-responsibility':'equipment','interest-learning':'tools'
  });
  const rows=projectEducationOptions(evaluation,interest,{limit:40});
  assert.ok(rows.some(x=>/aviation|engineering|mechatronics|machin/i.test(`${x.name} ${x.family}`)));
});
