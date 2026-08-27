import {
  ROUTE_SIEVE_OPTIONS,SIEVE_QUESTIONS,INTEREST_QUESTIONS,TUESDAY_QUESTIONS,
  buildDecisionProfileFromAnswers,buildInterestProfile,applyTuesdayAnswers,evaluateCardinal,
  projectCareerPaths,projectMilitarySpecialties,militaryCatalogStats,educationCatalogStats,SOURCE_BY_ID
} from './cardinal/index.js';

const app=document.querySelector('#app');
const freshState=()=>({screen:'home',sieveIndex:0,interestIndex:0,tuesdayIndex:0,sieveAnswers:{},interestAnswers:{},tuesdayAnswers:{},selectedRoutes:[]});
let state=freshState();
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const pct=v=>v==null?'—':`${v}%`;

function topbar(label='Central NC'){return `<header class="topbar"><div class="brand"><div class="brand-mark" aria-hidden="true">CC</div><span>Cardinal Career Arbitrage</span></div><span class="pill">${label}</span></header>`;}
function footer(){return `<footer><strong>Independent tool.</strong> Cardinal Career Arbitrage is independently developed and is not an official Cornerstone Charter Academy program or endorsement. It is educational decision support, not a validated vocational assessment. Military specialty availability and qualification standards, admissions, tuition, benefits, apprenticeships, wages and labor-market conditions change. Verify consequential decisions with the institution, employer, service or recruiter. Data snapshot: August 2026.</footer>`;}
function reset(){state=freshState();render();}
function progressMeta(index,total,label){const p=Math.round(((index+1)/total)*100);return `<div class="progress-wrap"><div class="progress-meta"><span>${label}</span><span>${index+1} / ${total}</span></div><div class="progress"><div style="width:${p}%"></div></div></div>`;}

function renderHome(){
  const m=militaryCatalogStats(),e=educationCatalogStats();
  app.innerHTML=`${topbar('Central NC · 2026 data')}<section class="hero">
    <div class="eyebrow">Central North Carolina × real tradeoffs</div><h1>What does your next move actually buy you?</h1>
    <p class="lede">Start with the routes you are genuinely willing to consider. Price the tradeoffs before seeing career titles, add a short interest signal, then compare occupations, military specialties and nearby education/training paths without a prestige curve.</p>
    <div class="cta-row"><button class="btn primary" id="start">Start Cardinal</button></div>
    <div class="metrics"><div class="metric"><span>Routes first</span><strong>No default winner</strong><span>College, technical education, apprenticeship, military/service and direct work are peers.</span></div><div class="metric"><span>Wide net</span><strong>${m.total} military specialties</strong><span>Army, Air Force, Navy, Marine Corps, Coast Guard and Space Force inventory.</span></div><div class="metric"><span>Local layer</span><strong>${e.total} study options</strong><span>The catalog is broad, but results only show study paths that actually fit each displayed career.</span></div></div>
    <div class="surface"><div class="callout"><strong>No prestige curve.</strong> A route rises or falls because of what you say matters: cost, speed, obligation, work style, location, certainty and interests. ASVAB/line scores and selective admissions are qualification gates, not measures of a person’s worth.</div></div>
  </section>${footer()}`;
  document.querySelector('#start').onclick=()=>{state.screen='sieve';render();};
}

function renderRouteQuestion(q){
  const selected=new Set(state.selectedRoutes);
  app.innerHTML=`${topbar('Route sieve')}${progressMeta(state.sieveIndex,SIEVE_QUESTIONS.length,'Routes + tradeoffs')}<section class="question-card"><div class="phase">${q.phase}</div><h2>${q.prompt}</h2><p>${q.context}</p><div class="option-list">${ROUTE_SIEVE_OPTIONS.map(o=>`<button class="route-option ${selected.has(o.id)?'selected':''}" data-id="${o.id}" aria-pressed="${selected.has(o.id)}"><strong>${o.label}</strong><small>${o.description}</small></button>`).join('')}</div><div class="cta-row"><button class="btn ghost" id="all">Keep every route open</button><button class="btn primary" id="continue" ${selected.size?'':'disabled'}>Continue</button></div></section><div class="quiz-actions"><button class="btn ghost" id="back">← Back</button><button class="btn ghost danger" id="restart">Restart</button></div>${footer()}`;
  document.querySelectorAll('.route-option').forEach(btn=>btn.onclick=()=>{const id=btn.dataset.id;selected.has(id)?selected.delete(id):selected.add(id);state.selectedRoutes=[...selected];renderRouteQuestion(q);});
  document.querySelector('#all').onclick=()=>{state.selectedRoutes=ROUTE_SIEVE_OPTIONS.map(x=>x.id);renderRouteQuestion(q);};
  document.querySelector('#continue').onclick=()=>{state.sieveAnswers[q.id]=[...state.selectedRoutes];state.sieveIndex++;if(state.sieveIndex>=SIEVE_QUESTIONS.length){state.screen='interest';state.interestIndex=0;}window.scrollTo({top:0});render();};
  document.querySelector('#back').onclick=()=>{state.screen='home';render();}; document.querySelector('#restart').onclick=reset;
}

function renderChoiceQuestion(q){
  app.innerHTML=`${topbar('Tradeoff sieve')}${progressMeta(state.sieveIndex,SIEVE_QUESTIONS.length,'Routes + tradeoffs')}<section class="question-card"><div class="phase">${q.phase}</div><h2>${q.prompt}</h2><p>${q.context}</p><div class="option-list">${q.options.map(o=>`<button class="option" data-id="${o.id}"><strong>${o.label}</strong>${o.description?`<small>${o.description}</small>`:''}</button>`).join('')}</div></section><div class="quiz-actions"><button class="btn ghost" id="back">← Back</button><button class="btn ghost danger" id="restart">Restart</button></div>${footer()}`;
  document.querySelectorAll('.option').forEach(btn=>btn.onclick=()=>{state.sieveAnswers[q.id]=btn.dataset.id;state.sieveIndex++;if(state.sieveIndex>=SIEVE_QUESTIONS.length){state.screen='interest';state.interestIndex=0;}window.scrollTo({top:0});render();});
  document.querySelector('#back').onclick=()=>{if(state.sieveIndex<=0){state.screen='home';render();return;}state.sieveIndex--;const prev=SIEVE_QUESTIONS[state.sieveIndex];delete state.sieveAnswers[prev.id];if(prev.type==='route-multiselect')state.selectedRoutes=[];render();}; document.querySelector('#restart').onclick=reset;
}
function renderSieve(){const q=SIEVE_QUESTIONS[state.sieveIndex];q.type==='route-multiselect'?renderRouteQuestion(q):renderChoiceQuestion(q);}

function renderInterest(){
  const q=INTEREST_QUESTIONS[state.interestIndex];
  app.innerHTML=`${topbar('Interest signal')}${progressMeta(state.interestIndex,INTEREST_QUESTIONS.length,'What kind of work pulls you?')}<section class="question-card"><div class="phase">career-title blind</div><h2>${q.prompt}</h2><p>Pick the work itself. We still are not showing career names, schools, military jobs or salaries.</p><div class="option-list">${q.options.map(o=>`<button class="option" data-id="${o.id}"><strong>${o.label}</strong></button>`).join('')}</div></section><div class="quiz-actions"><button class="btn ghost" id="back">← Back</button><button class="btn ghost danger" id="restart">Restart</button></div>${footer()}`;
  document.querySelectorAll('.option').forEach(btn=>btn.onclick=()=>{state.interestAnswers[q.id]=btn.dataset.id;state.interestIndex++;if(state.interestIndex>=INTEREST_QUESTIONS.length){state.screen='tuesday';state.tuesdayIndex=0;}window.scrollTo({top:0});render();});
  document.querySelector('#back').onclick=()=>{if(state.interestIndex===0){state.screen='sieve';state.sieveIndex=SIEVE_QUESTIONS.length-1;delete state.sieveAnswers[SIEVE_QUESTIONS[state.sieveIndex].id];render();return;}state.interestIndex--;delete state.interestAnswers[INTEREST_QUESTIONS[state.interestIndex].id];render();}; document.querySelector('#restart').onclick=reset;
}

function renderTuesday(){
  const q=TUESDAY_QUESTIONS[state.tuesdayIndex];
  app.innerHTML=`${topbar('Ordinary Tuesday')}${progressMeta(state.tuesdayIndex,TUESDAY_QUESTIONS.length,'Workday calibration')}<section class="question-card"><div class="phase">ordinary tuesday</div><h2>${q.prompt}</h2><p>Pick the workday you would rather live with, not the title you think sounds impressive.</p><div class="option-list">${q.options.map(o=>`<button class="option" data-id="${o.id}"><strong>${o.label}</strong></button>`).join('')}</div></section><div class="quiz-actions"><button class="btn ghost" id="back">← Back</button><button class="btn ghost danger" id="restart">Restart</button></div>${footer()}`;
  document.querySelectorAll('.option').forEach(btn=>btn.onclick=()=>{state.tuesdayAnswers[q.id]=btn.dataset.id;state.tuesdayIndex++;if(state.tuesdayIndex>=TUESDAY_QUESTIONS.length)state.screen='results';window.scrollTo({top:0});render();});
  document.querySelector('#back').onclick=()=>{if(state.tuesdayIndex===0){state.screen='interest';state.interestIndex=INTEREST_QUESTIONS.length-1;delete state.interestAnswers[INTEREST_QUESTIONS[state.interestIndex].id];render();return;}state.tuesdayIndex--;delete state.tuesdayAnswers[TUESDAY_QUESTIONS[state.tuesdayIndex].id];render();}; document.querySelector('#restart').onclick=reset;
}

function dimensionCopy(r){return r?`${r.label}: ${r.value} vs your target ${r.target}`:'';}
function routeCard(row,rank){const s=row.strengths.slice(0,2).map(dimensionCopy).join(' · '),f=row.frictions.slice(0,1).map(dimensionCopy).join('');return `<article class="card"><div class="card-head"><div><div class="kicker">Route ${String(rank).padStart(2,'0')}</div><h3>${row.name}</h3></div><div class="score">${pct(row.score)}</div></div><p class="micro">${row.description}</p><div class="tags"><span class="tag">${row.type}</span><span class="tag">${row.coverage}% evidence coverage</span></div><p class="micro"><span class="good">Pull:</span> ${s||'No strong weighted route preference.'}</p>${f?`<p class="micro"><span class="warn">Tradeoff:</span> ${f}</p>`:''}</article>`;}

function pathRow(path){
  const relation=path.relationship==='direct'?'Direct':path.relationship==='strong'?'Strong':path.relationship==='adjacent'?'Adjacent':'Exploratory';
  const locality=path.scope==='triad-core'?'Triad core':path.scope==='central-nc-extended'?'Regional':'Mapped route';
  return `<div class="reason"><strong>${path.institution} · ${path.name}</strong><br><span class="micro">${path.award||'Training path'} · ${path.routeType} · ${relation} connection · ${locality}</span></div>`;
}

function careerPathCard(group){
  const row=group.occupationRow,o=group.occupation,local=o.localEvidence?.medianWage;
  const strengths=row.strengths.slice(0,2).map(dimensionCopy).join(' · '),friction=row.frictions.slice(0,1).map(dimensionCopy).join('');
  const paths=group.paths.length?`<div class="reason-list">${group.paths.map(pathRow).join('')}</div>`:`<div class="callout"><strong>No education/training path shown for this career under the routes you kept open.</strong> Cardinal will not fill the gap with an unrelated major. A valid path may exist outside the current mapped catalog.</div>`;
  return `<article class="card"><div class="card-head"><div><div class="kicker">Career ${String(group.rank).padStart(2,'0')} · ${o.soc}</div><h3>${o.name}</h3></div><div class="score">${pct(row.score)}</div></div><div class="tags"><span class="tag">${o.family}</span>${local?`<span class="tag">GSO-HP median ${money(local)}</span>`:''}</div><p class="micro"><strong>Typical entry:</strong> ${o.typicalEntry}</p><p class="micro"><span class="good">Matched:</span> ${strengths}</p>${friction?`<p class="micro"><span class="warn">Watch:</span> ${friction}</p>`:''}<h4 style="margin:1rem 0 .55rem">Ways in that actually match this career</h4>${paths}</article>`;
}

function militaryCard(row,rank){const gate=row.asvab?.text||((row.asvab?.system&&row.asvab?.minimum!=null)?`${row.asvab.system} ${row.asvab.minimum}+`:null);return `<article class="card"><div class="card-head"><div><div class="kicker">${row.service} · ${row.code||'career field'}</div><h3>${row.title}</h3></div><div class="score">${row.score}</div></div><div class="tags"><span class="tag">${row.rankPath}</span><span class="tag">${row.family}</span>${row.components.map(c=>`<span class="tag">${c}</span>`).join('')}</div>${gate?`<p class="micro"><strong>Published aptitude gate:</strong> ${gate}. Verify current qualification rules before treating this as definitive.</p>`:'<p class="micro"><strong>Qualification:</strong> ASVAB/composite, medical, citizenship/clearance and other requirements vary by specialty. Verify the current service job page or recruiter.</p>'}<p class="micro">Interest signal ${row.interestScore??'—'}${row.occupationScore!=null?` · civilian-occupation fit ${row.occupationScore}`:''}</p></article>`;}
function interestStrip(profile){return `<div class="tags">${profile.top.slice(0,5).map(x=>`<span class="tag">${x.label} ${x.score}</span>`).join('')}</div>`;}
function eliminationRows(groups){if(!groups.length)return '<p class="micro">Your hard constraints did not eliminate anything in this category.</p>';return `<div class="reason-list">${groups.slice(0,5).map(g=>`<div class="reason"><strong>${g.count} removed.</strong> ${g.reason.message||'Route not selected.'}<br><span class="micro">Examples: ${g.examples.map(x=>x.name).join(', ')}</span></div>`).join('')}</div>`;}

function renderResults(){
  let baseProfile;try{baseProfile=buildDecisionProfileFromAnswers(state.sieveAnswers);}catch(err){app.innerHTML=`${topbar('Error')}<section class="surface"><h2>Profile error</h2><p>${err.message}</p><button class="btn primary" id="reset">Restart</button></section>${footer()}`;document.querySelector('#reset').onclick=reset;return;}
  const interestProfile=buildInterestProfile(state.interestAnswers),finalProfile=applyTuesdayAnswers(baseProfile,state.tuesdayAnswers),evaluation=evaluateCardinal(finalProfile);
  const routes=evaluation.routes.surviving.slice(0,4);
  const careerGroups=projectCareerPaths(evaluation,interestProfile,{occupationLimit:6,maxPathsPerOccupation:5,maxDirectPerOccupation:3});
  const militaryRows=projectMilitarySpecialties(evaluation,interestProfile,{limit:200});
  const militaryByService=Object.groupBy?Object.groupBy(militaryRows,x=>x.service):militaryRows.reduce((a,x)=>((a[x.service]||=[]).push(x),a),{});
  const selectedRouteLabels=finalProfile.allowedRouteTypes.map(id=>ROUTE_SIEVE_OPTIONS.find(x=>x.id===id)?.label||id).join(' · ');
  const sourceIds=new Set();
  careerGroups.forEach(group=>{(group.occupation.sourceIds||[]).forEach(id=>sourceIds.add(id));group.paths.forEach(path=>(path.sourceIds||[]).forEach(id=>sourceIds.add(id)));});
  militaryRows.slice(0,30).forEach(row=>(row.sourceIds||[]).forEach(id=>sourceIds.add(id)));
  routes.forEach(r=>(r.route.sourceIds||[]).forEach(id=>sourceIds.add(id)));
  const sources=[...sourceIds].map(id=>SOURCE_BY_ID[id]).filter(Boolean).slice(0,26);

  const militarySection=militaryRows.length?`<section class="surface"><div class="surface-head"><div><div class="eyebrow">04 · Military specialty finder</div><h2>Service jobs that fit the work you described</h2></div><div class="micro">${militaryCatalogStats().total} specialties modeled · qualification gates are separate from fit</div></div>${Object.entries(militaryByService).map(([service,rows])=>`<h3 style="margin-top:1.2rem">${service}</h3><div class="result-grid">${rows.slice(0,4).map(militaryCard).join('')}</div>`).join('')}</section>`:'';

  app.innerHTML=`${topbar('Your reveal')}<section class="hero"><div class="eyebrow">The reveal</div><h1>Your next moves, not your destiny.</h1><p class="lede">Compatibility against the tradeoffs and work signals you chose. A high number means “fits what you told us,” not “better career” or “better person.”</p><div class="cta-row"><button class="btn primary" id="again">Run another test</button></div></section>
    <section class="surface"><div class="eyebrow">01 · Your work pulls</div><h2>What kept showing up</h2>${interestStrip(interestProfile)}<p class="micro">These signals help sort eligible options. They can rank education paths inside a career, but they cannot make an unrelated major count as a path to that career.</p></section>
    <section class="surface"><div class="surface-head"><div><div class="eyebrow">02 · Route bargains</div><h2>How you said you are willing to get there</h2></div><div class="micro">${evaluation.routes.eliminated.length} route variants removed</div></div><div class="result-grid">${routes.map(routeCard).join('')}</div></section>
    <section class="surface"><div class="surface-head"><div><div class="eyebrow">03 · Careers + ways in</div><h2>Each career is married to its own education and training paths</h2></div><div class="micro">Routes kept: ${selectedRouteLabels}</div></div><div class="callout"><strong>Career first, school second.</strong> Cardinal now requires a career-specific relationship before a degree, community-college program, apprenticeship or other training path can appear here. Interest only sorts valid paths; it cannot create one.</div><div class="result-grid" style="margin-top:1rem">${careerGroups.map(careerPathCard).join('')}</div></section>
    ${militarySection}
    <section class="surface"><div class="eyebrow">Tradeoffs · What you gave up</div><h2>Your hard constraints have consequences</h2><h3>Routes</h3>${eliminationRows(evaluation.tradeoffSummary.routeReasons)}<h3 style="margin-top:1.2rem">Occupations</h3>${eliminationRows(evaluation.tradeoffSummary.occupationReasons)}</section>
    <section class="surface"><div class="eyebrow">Evidence</div><h2>Sources behind this release</h2><p class="micro">The broad school catalog remains available behind Cardinal, but the reveal only shows education/training options with an explicit career relationship. Missing or unlinked items are not evidence against a route. ASVAB line scores, specialty availability and school programs can change.</p><div class="source-row">${sources.map(s=>`<a class="tag" href="${s.url}" target="_blank" rel="noreferrer">${s.title}</a>`).join('')}</div></section>${footer()}`;
  document.querySelector('#again').onclick=reset;
}

function render(){if(state.screen==='home')renderHome();else if(state.screen==='sieve')renderSieve();else if(state.screen==='interest')renderInterest();else if(state.screen==='tuesday')renderTuesday();else renderResults();}
render();
