import {
  ROUTE_SIEVE_OPTIONS,
  SIEVE_QUESTIONS,
  TUESDAY_QUESTIONS,
  buildDecisionProfileFromAnswers,
  applyTuesdayAnswers,
  evaluateCardinal,
  projectPrograms,
  SOURCE_BY_ID
} from './cardinal/index.js';

const app=document.querySelector('#app');
let state={screen:'home',sieveIndex:0,tuesdayIndex:0,sieveAnswers:{},tuesdayAnswers:{},selectedRoutes:[]};

const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const pct=v=>v==null?'—':`${v}%`;

function topbar(label='Central NC'){
  return `<header class="topbar"><div class="brand"><div class="brand-mark" aria-hidden="true">CC</div><span>Cardinal Career Arbitrage</span></div><span class="pill">${label}</span></header>`;
}

function footer(){
  return `<footer><strong>Independent tool.</strong> Cardinal Career Arbitrage is independently developed and is not an official Cornerstone Charter Academy program or endorsement. It is an educational decision-support tool, not a validated vocational assessment. Wage, tuition, admissions, military benefits, apprenticeship availability and labor-market conditions change. Data snapshot: August 2026.</footer>`;
}

function reset(){state={screen:'home',sieveIndex:0,tuesdayIndex:0,sieveAnswers:{},tuesdayAnswers:{},selectedRoutes:[]};render();}

function renderHome(){
  app.innerHTML=`${topbar('Central NC · 2026 data')}
  <section class="hero">
    <div class="eyebrow">Central North Carolina × real tradeoffs</div>
    <h1>What does your next move actually buy you?</h1>
    <p class="lede">Start with the routes you are willing to consider. Price the tradeoffs before seeing career titles. Then use a few ordinary-workday choices to reveal occupations and nearby programs that fit what <em>you</em> said matters.</p>
    <div class="cta-row"><button class="btn primary" id="start">Start Cardinal</button></div>
    <div class="metrics">
      <div class="metric"><span>First</span><strong>Routes</strong><span>College, community college, apprenticeships, military/service, direct work.</span></div>
      <div class="metric"><span>Then</span><strong>Tradeoffs</strong><span>Money, time, obligation, remote work, people, physical work, schedule and certainty.</span></div>
      <div class="metric"><span>Finally</span><strong>Local paths</strong><span>Occupation matches connected back to real Central NC programs and training routes.</span></div>
    </div>
    <div class="surface"><div class="callout"><strong>No prestige curve.</strong> Four-year college, an apprenticeship, military service and a technical credential are peers in the model. A route rises or falls because of your stated preferences and constraints, not because the app has a preferred definition of success.</div></div>
  </section>${footer()}`;
  document.querySelector('#start').onclick=()=>{state.screen='sieve';state.sieveIndex=0;render();};
}

function progressMeta(index,total,label){
  const p=Math.round(((index+1)/total)*100);
  return `<div class="progress-wrap"><div class="progress-meta"><span>${label}</span><span>${index+1} / ${total}</span></div><div class="progress"><div style="width:${p}%"></div></div></div>`;
}

function renderRouteQuestion(question){
  const selected=new Set(state.selectedRoutes);
  app.innerHTML=`${topbar('Route sieve')}${progressMeta(state.sieveIndex,SIEVE_QUESTIONS.length,'Route sieve + tradeoffs')}
    <section class="question-card"><div class="phase">${question.phase}</div><h2>${question.prompt}</h2><p>${question.context}</p>
      <div class="option-list">${ROUTE_SIEVE_OPTIONS.map(o=>`<button class="route-option ${selected.has(o.id)?'selected':''}" data-id="${o.id}" aria-pressed="${selected.has(o.id)}"><strong>${o.label}</strong><small>${o.description}</small></button>`).join('')}</div>
      <div class="cta-row"><button class="btn ghost" id="all">Keep every route open</button><button class="btn primary" id="continue" ${selected.size?'':'disabled'}>Continue</button></div>
    </section><div class="quiz-actions"><button class="btn ghost" id="back">← Back</button><button class="btn ghost danger" id="restart">Restart</button></div>${footer()}`;
  document.querySelectorAll('.route-option').forEach(btn=>btn.onclick=()=>{
    const id=btn.dataset.id;
    if(selected.has(id)) selected.delete(id); else selected.add(id);
    state.selectedRoutes=[...selected];
    renderRouteQuestion(question);
  });
  document.querySelector('#all').onclick=()=>{state.selectedRoutes=ROUTE_SIEVE_OPTIONS.map(x=>x.id);renderRouteQuestion(question);};
  document.querySelector('#continue').onclick=()=>{
    state.sieveAnswers[question.id]=[...state.selectedRoutes];
    state.sieveIndex++;
    if(state.sieveIndex>=SIEVE_QUESTIONS.length){state.screen='tuesday';state.tuesdayIndex=0;}
    window.scrollTo({top:0,behavior:'auto'});render();
  };
  document.querySelector('#back').onclick=()=>{state.screen='home';render();};
  document.querySelector('#restart').onclick=reset;
}

function renderChoiceQuestion(question){
  app.innerHTML=`${topbar('Tradeoff sieve')}${progressMeta(state.sieveIndex,SIEVE_QUESTIONS.length,'Route sieve + tradeoffs')}
    <section class="question-card"><div class="phase">${question.phase}</div><h2>${question.prompt}</h2><p>${question.context}</p>
      <div class="option-list">${question.options.map(o=>`<button class="option" data-id="${o.id}"><strong>${o.label}</strong>${o.description?`<small>${o.description}</small>`:''}</button>`).join('')}</div>
    </section><div class="quiz-actions"><button class="btn ghost" id="back">← Back</button><button class="btn ghost danger" id="restart">Restart</button></div>${footer()}`;
  document.querySelectorAll('.option').forEach(btn=>btn.onclick=()=>{
    state.sieveAnswers[question.id]=btn.dataset.id;
    state.sieveIndex++;
    if(state.sieveIndex>=SIEVE_QUESTIONS.length){state.screen='tuesday';state.tuesdayIndex=0;}
    window.scrollTo({top:0,behavior:'auto'});render();
  });
  document.querySelector('#back').onclick=()=>{
    if(state.sieveIndex<=0){state.screen='home';render();return;}
    state.sieveIndex--;
    const prev=SIEVE_QUESTIONS[state.sieveIndex];
    delete state.sieveAnswers[prev.id];
    if(prev.type==='route-multiselect') state.selectedRoutes=[];
    render();
  };
  document.querySelector('#restart').onclick=reset;
}

function renderSieve(){
  const question=SIEVE_QUESTIONS[state.sieveIndex];
  if(question.type==='route-multiselect') renderRouteQuestion(question); else renderChoiceQuestion(question);
}

function renderTuesday(){
  const q=TUESDAY_QUESTIONS[state.tuesdayIndex];
  app.innerHTML=`${topbar('Ordinary Tuesday')}${progressMeta(state.tuesdayIndex,TUESDAY_QUESTIONS.length,'Workday calibration')}
    <section class="question-card"><div class="phase">ordinary tuesday</div><h2>${q.prompt}</h2><p>Career titles stay hidden for a few more clicks. Pick the workday you would rather live with, not the title you think sounds impressive.</p>
      <div class="option-list">${q.options.map(o=>`<button class="option" data-id="${o.id}"><strong>${o.label}</strong></button>`).join('')}</div>
    </section><div class="quiz-actions"><button class="btn ghost" id="back">← Back</button><button class="btn ghost danger" id="restart">Restart</button></div>${footer()}`;
  document.querySelectorAll('.option').forEach(btn=>btn.onclick=()=>{
    state.tuesdayAnswers[q.id]=btn.dataset.id;
    state.tuesdayIndex++;
    if(state.tuesdayIndex>=TUESDAY_QUESTIONS.length) state.screen='results';
    window.scrollTo({top:0,behavior:'auto'});render();
  });
  document.querySelector('#back').onclick=()=>{
    if(state.tuesdayIndex===0){state.screen='sieve';state.sieveIndex=SIEVE_QUESTIONS.length-1;delete state.sieveAnswers[SIEVE_QUESTIONS[state.sieveIndex].id];render();return;}
    state.tuesdayIndex--;delete state.tuesdayAnswers[TUESDAY_QUESTIONS[state.tuesdayIndex].id];render();
  };
  document.querySelector('#restart').onclick=reset;
}

function dimensionCopy(row){
  if(!row) return '';
  return `${row.label}: ${row.value} vs your target ${row.target}`;
}

function routeCard(row,rank){
  const strengths=row.strengths.slice(0,2).map(dimensionCopy).join(' · ');
  const friction=row.frictions.slice(0,1).map(dimensionCopy).join('');
  return `<article class="card"><div class="card-head"><div><div class="kicker">Route ${String(rank).padStart(2,'0')}</div><h3>${row.name}</h3></div><div class="score">${pct(row.score)}</div></div><p class="micro">${row.description}</p><div class="tags"><span class="tag">${row.type}</span><span class="tag">${row.coverage}% evidence coverage</span></div><p class="micro"><span class="good">Pull:</span> ${strengths||'No strong weighted route preference.'}</p>${friction?`<p class="micro"><span class="warn">Tradeoff:</span> ${friction}</p>`:''}</article>`;
}

function occupationCard(row,rank){
  const o=row.occupation;
  const local=o.localEvidence?.medianWage;
  const strengths=row.strengths.slice(0,2).map(dimensionCopy).join(' · ');
  const friction=row.frictions.slice(0,1).map(dimensionCopy).join('');
  return `<article class="card"><div class="card-head"><div><div class="kicker">Occupation ${String(rank).padStart(2,'0')} · ${o.soc}</div><h3>${o.name}</h3></div><div class="score">${pct(row.score)}</div></div>
    <div class="tags"><span class="tag">${o.family}</span>${local?`<span class="tag">GSO-HP median ${money(local)}</span>`:''}<span class="tag">${row.coverage}% coverage</span></div>
    <p class="micro"><strong>Typical entry:</strong> ${o.typicalEntry}</p><p class="micro"><span class="good">Matched:</span> ${strengths}</p>${friction?`<p class="micro"><span class="warn">Watch:</span> ${friction}</p>`:''}</article>`;
}

function programCard(row,rank){
  const p=row.program;
  const best=row.bestOccupation;
  return `<article class="card"><div class="card-head"><div><div class="kicker">Local bridge ${String(rank).padStart(2,'0')}</div><h3>${p.name}</h3><div class="micro">${p.institution}</div></div><div class="score">${row.alignmentScore==null?'—':row.alignmentScore}</div></div>
    <div class="program-meta"><div><span>Credential</span><b>${p.credential}</b></div><div><span>Normal duration</span><b>${p.durationMonths?`${p.durationMonths} mo.`:'Varies'}</b></div><div><span>On-ramp clarity</span><b>${p.onRampClarity}/5</b></div></div>
    <p class="micro"><strong>Admission gate:</strong> ${p.admissionGate}</p>${p.earnWhileLearning?`<div class="tags"><span class="tag">Earn while learning</span></div>`:''}
    ${best?`<p class="micro"><strong>${best.relationship}</strong> connection to ${best.occupationName} · occupational compatibility ${best.occupationScore}%${best.note?` · ${best.note}`:''}</p>`:'<p class="micro">Gateway/transfer route; no single occupation should be inferred from the credential alone.</p>'}
  </article>`;
}

function sourceLinks(evaluation,programRows){
  const ids=new Set();
  evaluation.routes.surviving.slice(0,4).forEach(r=>(r.route.sourceIds||[]).forEach(id=>ids.add(id)));
  evaluation.occupations.surviving.slice(0,6).forEach(r=>(r.occupation.sourceIds||[]).forEach(id=>ids.add(id)));
  programRows.slice(0,6).forEach(r=>(r.program.sourceIds||[]).forEach(id=>ids.add(id)));
  return [...ids].map(id=>SOURCE_BY_ID[id]).filter(Boolean).slice(0,18);
}

function eliminationRows(groups){
  if(!groups.length) return '<p class="micro">Your hard constraints did not eliminate anything in this category.</p>';
  return `<div class="reason-list">${groups.slice(0,5).map(g=>{
    const names=g.examples.map(x=>x.name).join(', ');
    const rule=g.reason.message || 'Route not selected.';
    return `<div class="reason"><strong>${g.count} removed.</strong> ${rule}<br><span class="micro">Examples: ${names}</span></div>`;
  }).join('')}</div>`;
}

function renderResults(){
  let baseProfile;
  try{baseProfile=buildDecisionProfileFromAnswers(state.sieveAnswers);}catch(err){app.innerHTML=`${topbar('Error')}<section class="surface"><h2>We hit a profile error.</h2><p>${err.message}</p><button class="btn primary" id="reset">Restart</button></section>${footer()}`;document.querySelector('#reset').onclick=reset;return;}
  const finalProfile=applyTuesdayAnswers(baseProfile,state.tuesdayAnswers);
  const evaluation=evaluateCardinal(finalProfile);
  const programRows=projectPrograms(evaluation,{limit:10});
  const routes=evaluation.routes.surviving.slice(0,4);
  const occupations=evaluation.occupations.surviving.slice(0,6);
  const sources=sourceLinks(evaluation,programRows);

  app.innerHTML=`${topbar('Your reveal')}
    <section class="hero"><div class="eyebrow">The reveal</div><h1>Your next moves, not your destiny.</h1><p class="lede">These are compatibility results against the tradeoffs you chose. They are not a ranking of human worth, prestige, or universal career quality.</p>
      <div class="cta-row"><button class="btn primary" id="again">Run another test</button></div>
    </section>

    <section class="surface"><div class="surface-head"><div><div class="eyebrow">01 · Route bargains</div><h2>How you said you are willing to get there</h2></div><div class="micro">${evaluation.routes.eliminated.length} route variants removed</div></div><div class="result-grid">${routes.map(routeCard).join('')}</div></section>

    <section class="surface"><div class="surface-head"><div><div class="eyebrow">02 · Occupations</div><h2>Work that fits the life you described</h2></div><div class="micro">${evaluation.occupations.eliminated.length} occupations removed by hard constraints</div></div><div class="result-grid">${occupations.map(occupationCard).join('')}</div></section>

    <section class="surface"><div class="surface-head"><div><div class="eyebrow">03 · Central NC bridges</div><h2>Actual programs that connect to surviving occupations</h2></div><div class="micro">Alignment = occupation compatibility × relationship strength. It is not a school ranking.</div></div><div class="result-grid">${programRows.slice(0,8).map(programCard).join('')}</div></section>

    <section class="surface"><div class="eyebrow">04 · What you gave up</div><h2>Your constraints have consequences</h2><p class="micro">Preferences only rank. Hard limits and routes you explicitly declined are what actually remove options.</p><h3>Routes</h3>${eliminationRows(evaluation.tradeoffSummary.routeReasons)}<h3 style="margin-top:1.2rem">Occupations</h3>${eliminationRows(evaluation.tradeoffSummary.occupationReasons)}</section>

    <section class="surface"><div class="eyebrow">05 · Evidence</div><h2>Sources behind this release</h2><p class="micro">The current release intentionally uses a bounded local program/occupation set. Missing programs are not evidence against a career. The catalog will evolve as source data changes and coverage expands.</p><div class="source-row">${sources.map(s=>`<a class="tag" href="${s.url}" target="_blank" rel="noreferrer">${s.title}</a>`).join('')}</div></section>
    ${footer()}`;
  document.querySelector('#again').onclick=reset;
}

function render(){
  if(state.screen==='home') renderHome();
  else if(state.screen==='sieve') renderSieve();
  else if(state.screen==='tuesday') renderTuesday();
  else renderResults();
}

render();
