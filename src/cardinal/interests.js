export const INTEREST_DIMENSIONS=Object.freeze({
  build:{label:'Build / repair / operate',description:'Tools, machines, physical systems, equipment and tangible output.'},
  analyze:{label:'Investigate / analyze / troubleshoot',description:'Data, diagnosis, research, logic and figuring out why something happened.'},
  create:{label:'Create / design',description:'Visual, written, digital or physical design and original expression.'},
  help:{label:'Help / teach / serve',description:'Improve another person’s outcome through care, instruction, service or advocacy.'},
  lead:{label:'Lead / persuade / decide',description:'Set direction, negotiate, influence and take responsibility for decisions.'},
  organize:{label:'Organize / coordinate / execute',description:'Plans, logistics, procedures, schedules, records and keeping complex work moving.'},
  communicate:{label:'Explain / write / present',description:'Translate ideas, tell stories, brief people and make information understandable.'}
});

const O=(id,label,tags)=>Object.freeze({id,label,tags});
export const INTEREST_QUESTIONS=Object.freeze([
  {id:'interest-problem',prompt:'Something important is not working. Which part sounds most satisfying?',options:[
    O('fix-it','Get hands-on and make the equipment or system work again',['build','analyze']),
    O('find-cause','Dig through clues, data or evidence until I know the cause',['analyze']),
    O('coordinate','Organize the response and keep everybody moving',['organize','lead']),
    O('explain','Figure out how to explain the problem and solution clearly',['communicate','help'])
  ]},
  {id:'interest-output',prompt:'At the end of a good day, which result would feel best?',options:[
    O('tangible','Something tangible works because I built, repaired or operated it',['build']),
    O('answer','I solved a difficult question or found the right answer',['analyze']),
    O('original','I made something original that people can see, read or use',['create']),
    O('person','A person or group is better off because I helped them',['help'])
  ]},
  {id:'interest-group',prompt:'In a group project, which role do you naturally drift toward?',options:[
    O('technical','The technical person who figures out how it actually works',['build','analyze']),
    O('leader','The person who sets direction and makes calls',['lead']),
    O('planner','The person who builds the plan, checklist and timeline',['organize']),
    O('presenter','The person who writes, explains or presents the result',['communicate','create'])
  ]},
  {id:'interest-mess',prompt:'Which kind of messy problem would you rather inherit?',options:[
    O('machine','A machine, vehicle, network or facility that keeps failing',['build','analyze']),
    O('data','A pile of conflicting data and no obvious answer',['analyze']),
    O('people','People who need guidance, care, instruction or advocacy',['help','communicate']),
    O('process','A chaotic process with missed handoffs and wasted effort',['organize','lead'])
  ]},
  {id:'interest-create',prompt:'If you had to make one thing from scratch, which sounds least annoying?',options:[
    O('physical','A physical system, device, structure or working prototype',['build','create']),
    O('model','A model, analysis, program or automated solution',['analyze','create']),
    O('message','A video, design, article, campaign or presentation',['create','communicate']),
    O('service','A program, event or service that helps people',['help','organize'])
  ]},
  {id:'interest-responsibility',prompt:'Which responsibility sounds most tolerable for years, not just one day?',options:[
    O('equipment','Being the person who knows the equipment or technical system cold',['build','analyze']),
    O('accuracy','Being the person trusted to get the analysis or facts right',['analyze','organize']),
    O('people-result','Being accountable for people, customers, patients or students getting a good outcome',['help','lead']),
    O('mission','Being accountable for coordinating a mission, operation or business result',['lead','organize'])
  ]},
  {id:'interest-learning',prompt:'Which kind of learning would you most willingly keep doing after school?',options:[
    O('tools','New tools, equipment, vehicles, electronics or technical procedures',['build']),
    O('complex','New technical, scientific, mathematical or analytical ideas',['analyze']),
    O('creative','New creative tools, media, design techniques or ways to communicate',['create','communicate']),
    O('human','New ways to teach, coach, care for, lead or understand people',['help','lead'])
  ]}
]);

export function buildInterestProfile(answers={}){
  const raw=Object.fromEntries(Object.keys(INTEREST_DIMENSIONS).map(k=>[k,0]));
  let answered=0;
  for(const q of INTEREST_QUESTIONS){
    const answer=answers[q.id];
    if(!answer) continue;
    const option=q.options.find(o=>o.id===answer);
    if(!option) throw new Error(`Unknown interest answer ${answer} for ${q.id}`);
    answered++;
    for(const tag of option.tags) raw[tag]=(raw[tag]||0)+1;
  }
  const max=Math.max(1,...Object.values(raw));
  const scores=Object.fromEntries(Object.entries(raw).map(([k,v])=>[k,Math.round(v/max*100)]));
  return Object.freeze({answered,scores,top:Object.entries(scores).sort((a,b)=>b[1]-a[1]).map(([id,score])=>({id,score,label:INTEREST_DIMENSIONS[id].label}))});
}

export function scoreInterestTags(tags=[],profile){
  if(!tags.length||!profile?.answered) return null;
  const vals=tags.map(t=>profile.scores[t]).filter(Number.isFinite);
  if(!vals.length) return null;
  return Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
}
