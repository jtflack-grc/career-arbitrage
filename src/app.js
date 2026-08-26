import { CAREERS, QUESTIONS, SOURCES } from './data.js';
import { initialProfile, applyEffects, rankCareers, explainMatch, simulateCareer, topProfileTraits, profileSignal } from './engine.js';

const app = document.querySelector('#app');
let state = {screen:'home', q:0, profile:initialProfile(), answers:[], selected:[]};

const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);

function topbar(label='Decision simulator') {
  return `<header class="topbar"><div class="brand"><div class="brand-mark" aria-hidden="true">CA</div><span>Career Arbitrage</span></div><span class="pill">${label}</span></header>`;
}
function footer() {
  return `<footer>Educational decision simulator, not a validated vocational assessment. Pay, tuition, admissions and labor-market conditions change. Results are prompts for investigation, not instructions. Data snapshot: August 2026.</footer>`;
}
function renderHome() {
  app.innerHTML = `${topbar('v0.1')}
    <section class="hero">
      <div class="eyebrow">Money × time × work × optionality</div>
      <h1 class="display">Don’t pick a career. Interrogate the tradeoffs.</h1>
      <p class="lede">The job titles stay hidden until the end. Choose the workday, schooling, risk and financial tradeoffs first. Then see which careers actually fit the life you chose.</p>
      <div class="cta-row"><button class="btn primary" id="start">Start the simulation</button><button class="btn ghost" id="method" aria-expanded="false" aria-controls="method-panel">How it works</button></div>
      <div class="method-panel" id="method-panel" hidden><strong>No personality-test astrology.</strong> Thirty choices build a hidden preference profile across 14 dimensions. Careers are ranked against those preferences. The scoring code is public after you play.</div>
      <div class="metrics" aria-label="Simulation summary">
        <div class="metric"><span>Scenario decisions</span><strong>${QUESTIONS.length}</strong><span>Work, school, money, schedule and pressure.</span></div>
        <div class="metric"><span>Career paths</span><strong>${CAREERS.length}</strong><span>Healthcare, tech, engineering, business and wild cards.</span></div>
        <div class="metric"><span>After the reveal</span><strong>18→35</strong><span>Compare three paths with a rough wealth race.</span></div>
      </div>
    </section>${footer()}`;
  document.querySelector('#start').onclick = () => { state={...state,screen:'quiz',q:0,profile:initialProfile(),answers:[],selected:[]}; render(); };
  document.querySelector('#method').onclick = event => {
    const panel=document.querySelector('#method-panel');
    const open=panel.hasAttribute('hidden');
    panel.toggleAttribute('hidden',!open);
    event.currentTarget.setAttribute('aria-expanded',String(open));
  };
}
function rebuildProfile() {
  let profile=initialProfile();
  state.answers.forEach(answer=>{
    const choice=QUESTIONS[answer.q]?.options[answer.choice];
    if(choice) profile=applyEffects(profile,choice.effects);
  });
  state.profile=profile;
}
function goBack() {
  if(state.q<=0) { state.screen='home'; render(); return; }
  state.answers=state.answers.slice(0,-1);
  state.q--;
  rebuildProfile();
  render();
}
function renderQuestion() {
  const q = QUESTIONS[state.q];
  const progress = ((state.q+1)/QUESTIONS.length)*100;
  app.innerHTML = `${topbar(q.round)}
    <div class="progress-wrap" aria-label="Simulation progress"><div class="progress-meta"><span>${q.round}</span><span>${state.q+1} / ${QUESTIONS.length}</span></div><div class="progress"><div style="width:${progress}%"></div></div></div>
    <section class="question-card">
      <div class="round-label">${q.round}</div>
      <h2>${q.prompt}</h2>
      <p class="question-context">${q.context}</p>
      <div class="option-list">${q.options.map((o,i)=>`<button class="option" data-i="${i}">${o.label}</button>`).join('')}</div>
    </section>
    <div class="quiz-actions"><button class="btn ghost" id="back">← Back</button><button class="btn ghost danger" id="restart">Restart</button></div>${footer()}`;
  document.querySelectorAll('.option').forEach(btn => btn.onclick = () => {
    const idx=Number(btn.dataset.i), choice=q.options[idx];
    state.profile=applyEffects(state.profile,choice.effects);
    state.answers.push({q:state.q,choice:idx});
    state.q++;
    if(state.q>=QUESTIONS.length) state.screen='results';
    window.scrollTo({top:0,behavior:'auto'});
    render();
  });
  document.querySelector('#back').onclick=goBack;
  document.querySelector('#restart').onclick=()=>{state={screen:'home',q:0,profile:initialProfile(),answers:[],selected:[]};render();};
}
function traitText(row) {
  if(row.value>=68) return `High ${row.label.toLowerCase()}`;
  if(row.value<=32) return `Low ${row.label.toLowerCase()}`;
  return `Moderate ${row.label.toLowerCase()}`;
}
function matchCard(career, rank) {
  const e=explainMatch(state.profile,career,2);
  const strength=e.strengths.map(x=>traitText(x)).join(' · ');
  const friction=e.frictions.map(x=>`${x.label} mismatch`).join(' · ');
  return `<article class="match-card">
    <div class="rank">${String(rank).padStart(2,'0')}</div><div>
      <div class="match-title"><h3>${career.name}</h3><span class="score">${career.score}% fit</span></div>
      <div class="tags">${career.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      <p class="micro">${career.blurb}</p>
      <div class="why"><div class="good"><b>Why it matched</b><span class="micro">${strength}</span></div><div class="friction"><b>Watch-outs</b><span class="micro">${friction}${career.caveat?` · ${career.caveat}`:''}</span></div></div>
    </div>
  </article>`;
}
function signalCopy(signal) {
  if(signal>=62) return `Your answers showed a strong point of view (${signal}/100 signal strength), so the differences between these matches are meaningful.`;
  if(signal>=38) return `Your answers showed a moderate point of view (${signal}/100 signal strength). Treat the ranking as a useful shortlist, not a verdict.`;
  return `Your answers stayed fairly close to the middle (${signal}/100 signal strength). The simulator has weak evidence about what you actually value, so use the shortlist as a starting point rather than a strong recommendation.`;
}
function renderResults() {
  const ranked=rankCareers(state.profile), top=ranked.slice(0,8), traits=topProfileTraits(state.profile,6), signal=profileSignal(state.profile);
  if(!state.selected.length) state.selected=top.slice(0,3).map(x=>x.id);
  app.innerHTML = `${topbar('Results')}
    <section class="results-head"><div class="eyebrow">The reveal</div><h1>Your career profile.</h1><p class="lede">These are compatibility scores, not salary rankings. A lucrative career can lose because you rejected its schooling, schedule or workday. A lower-paying path can win because it fits the life you repeatedly chose.</p>
      <p class="signal-note">${signalCopy(signal)}</p>
      <div class="profile-bars">${traits.map(t=>`<div class="profile-row"><span>${t.label}</span><div class="mini-bar"><div style="width:${t.value}%"></div></div><b>${t.value}</b></div>`).join('')}</div>
    </section>
    <section class="matches" aria-label="Top career matches">${top.slice(0,5).map((x,i)=>matchCard(x,i+1)).join('')}</section>
    <section class="surface wealth"><div class="eyebrow">Wealth race</div><h2>Pick three paths and run them to age 35.</h2><p class="micro">A rough scenario model, not a financial forecast. Tuition and salary assumptions live in the public career dataset.</p>
      <div class="career-picks">${top.map(x=>`<button class="pick ${state.selected.includes(x.id)?'selected':''}" data-id="${x.id}" aria-pressed="${state.selected.includes(x.id)}">${x.name}</button>`).join('')}</div>
      <div class="pick-counter">${state.selected.length} of 3 selected</div>
      <div class="controls">
        <div class="control"><label for="invest">Invest from take-home</label><select id="invest"><option value=".10">10%</option><option value=".15" selected>15%</option><option value=".20">20%</option><option value=".25">25%</option></select></div>
        <div class="control"><label for="home">Live with family until</label><select id="home"><option value="20">20</option><option value="22" selected>22</option><option value="24">24</option><option value="18">Never</option></select></div>
        <div class="control"><label for="loan">Share of tuition borrowed</label><select id="loan"><option value="0">0%</option><option value=".5" selected>50%</option><option value="1">100%</option></select></div>
      </div>
      <button class="btn primary" id="race">Run the race</button><div id="raceout" aria-live="polite"></div>
    </section>
    <section class="surface"><div class="eyebrow">Sources & caveats</div><h2>Where the numbers come from</h2><p class="micro">Most wage anchors use the May 2025 BLS national wage release. Specialized CAA/perfusion figures use current 2026 North Carolina employer postings. Education costs are deliberately rough and should be replaced with a specific school plan before making an enrollment decision.</p><div class="sources-links">${SOURCES.map(([n,u])=>`<a class="tag" href="${u}" target="_blank" rel="noreferrer">${n}</a>`).join('')}</div></section>
    <div class="cta-row"><button class="btn ghost" id="again">Play again</button></div>${footer()}`;
  document.querySelectorAll('.pick').forEach(b=>b.onclick=()=>{
    const id=b.dataset.id;
    if(state.selected.includes(id)) state.selected=state.selected.filter(x=>x!==id);
    else if(state.selected.length<3) state.selected=[...state.selected,id];
    renderResults();
  });
  document.querySelector('#again').onclick=()=>{state={screen:'quiz',q:0,profile:initialProfile(),answers:[],selected:[]};render();};
  document.querySelector('#race').onclick=runRace;
}
function runRace(){
  const investRate=Number(document.querySelector('#invest').value), livingAtHomeUntil=Number(document.querySelector('#home').value), loanShare=Number(document.querySelector('#loan').value);
  if(state.selected.length!==3){document.querySelector('#raceout').innerHTML='<p class="note">Pick exactly three careers first.</p>';return;}
  const careers=state.selected.map(id=>CAREERS.find(c=>c.id===id));
  const sims=careers.map(c=>({c,rows:simulateCareer(c,{investRate,livingAtHomeUntil,loanShare})}));
  const ages=[20,22,25,30,35];
  document.querySelector('#raceout').innerHTML=`<div class="table-wrap"><table class="race-table"><thead><tr><th>Age</th>${careers.map(c=>`<th>${c.name}</th>`).join('')}</tr></thead><tbody>${ages.map(age=>`<tr><td>${age}</td>${sims.map(s=>{const r=s.rows.find(x=>x.age===age);return `<td>${money(r.netWorth)}</td>`}).join('')}</tr>`).join('')}</tbody></table></div><p class="note">Model: 27% haircut for taxes/withholding, selected investment rate, 7% investment return, 6.5% loan APR, simplified salary ramps, and a small savings boost while living with family. It deliberately ignores many real expenses, scholarships and employer benefits.</p>`;
}
function render(){ if(state.screen==='home')renderHome(); else if(state.screen==='quiz')renderQuestion(); else renderResults(); }
render();
