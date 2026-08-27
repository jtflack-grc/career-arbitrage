import { ROUTE_TYPES } from './schema.js';
import { createDecisionProfile } from './decision-engine.js';

export const ROUTE_SIEVE_OPTIONS = Object.freeze([
  {id:'four-year-college',label:'Four-year college',description:'Public or private university leading toward a bachelor degree.'},
  {id:'community-college',label:'Community college / technical credential',description:'Career AAS, certificate, diploma, or transfer degree.'},
  {id:'apprenticeship',label:'Paid apprenticeship / earn-and-learn',description:'Work for an employer while completing structured technical education.'},
  {id:'active-duty-military',label:'Active-duty military service',description:'Full-time military service, training, compensation, benefits, and service obligation.'},
  {id:'guard-reserve',label:'Guard / Reserve + civilian school or work',description:'Civilian education/work combined with part-time military service and possible activation.'},
  {id:'rotc',label:'ROTC / officer route',description:'Bachelor degree plus officer training followed by commissioned service.'},
  {id:'direct-work',label:'Work immediately',description:'Enter employment after high school and evaluate training or education later.'},
  {id:'structured-service-gap',label:'Structured service / gap year',description:'A time-bounded service or exploration program with an actual plan and next step.'}
]);

const choice = (id,label,patch={},description='') => ({id,label,patch,description});

export const SIEVE_QUESTIONS = Object.freeze([
  {
    id:'routes-open',phase:'route-sieve',type:'route-multiselect',
    prompt:'Which post-high-school routes are you genuinely willing to investigate?',
    context:'Select every route you are willing to learn more about. This is not a commitment and there is no prestige ranking.',
    options:ROUTE_SIEVE_OPTIONS
  },
  {
    id:'cost-pressure',phase:'tradeoffs',type:'choice',
    prompt:'How much does minimizing education or training cost matter?',
    context:'This is about the amount you are willing to risk before the path starts paying you.',
    options:[
      choice('critical','Very important — keep the up-front bet small',{routePreferences:{costBurden:{target:0,weight:5}},occupationPreferences:{educationCost:{target:0,weight:5}}}),
      choice('important','Important, but I will pay more for a strong payoff',{routePreferences:{costBurden:{target:0,weight:3}},occupationPreferences:{educationCost:{target:0,weight:3}}}),
      choice('flexible','I can tolerate a larger investment if the case is strong',{routePreferences:{costBurden:{target:25,weight:1}},occupationPreferences:{educationCost:{target:25,weight:1}}}),
      choice('neutral','Cost is not a major differentiator right now')
    ]
  },
  {
    id:'income-speed',phase:'tradeoffs',type:'choice',
    prompt:'How quickly do you want meaningful full-time income?',
    context:'There is a real trade between earning at 18–20 and delaying income for a longer credential.',
    options:[
      choice('now','As soon as possible',{routePreferences:{timeToIncome:{target:0,weight:5}},occupationPreferences:{timeToIncome:{target:0,weight:5},earlyIncome:{target:100,weight:4}}}),
      choice('two-years','I can wait about two years',{routePreferences:{timeToIncome:{target:20,weight:3}},occupationPreferences:{timeToIncome:{target:25,weight:3},earlyIncome:{target:100,weight:2}}}),
      choice('four-years','Four years is fine if the outcome is stronger',{routePreferences:{timeToIncome:{target:55,weight:2}},occupationPreferences:{timeToIncome:{target:55,weight:2}}}),
      choice('longer','I will wait longer if the return is compelling',{routePreferences:{timeToIncome:{target:75,weight:1}},occupationPreferences:{timeToIncome:{target:75,weight:1}}})
    ]
  },
  {
    id:'earn-while-learning',phase:'tradeoffs',type:'choice',
    prompt:'How valuable is being paid while you are still training?',
    context:'Apprenticeships, military service, and some direct-work routes behave very differently from full-time college here.',
    options:[
      choice('critical','Extremely valuable',{routePreferences:{earnWhileLearning:{target:100,weight:5}},occupationPreferences:{earnWhileTraining:{target:100,weight:4}}}),
      choice('nice','Nice to have',{routePreferences:{earnWhileLearning:{target:100,weight:2}},occupationPreferences:{earnWhileTraining:{target:100,weight:2}}}),
      choice('neutral','Not important')
    ]
  },
  {
    id:'location-control',phase:'tradeoffs',type:'choice',
    prompt:'How much control do you want over where you live during the next several years?',
    context:'Some routes preserve local control. Others may require relocation, assignment, travel, or deployment.',
    options:[
      choice('must-control','I strongly want to control where I live',{routePreferences:{locationControl:{target:100,weight:5}}}),
      choice('prefer-control','I prefer control but can bend for a good opportunity',{routePreferences:{locationControl:{target:100,weight:3}}}),
      choice('mobile','I am genuinely willing to relocate',{routePreferences:{locationControl:{target:45,weight:1}},occupationPreferences:{geographicPortability:{target:100,weight:2}}}),
      choice('neutral','Not sure / not important')
    ]
  },
  {
    id:'structured-obligation',phase:'kill-list',type:'choice',
    prompt:'How do you feel about signing up for a multi-year structured obligation?',
    context:'This can include military service or an employer-linked apprenticeship. Leaving early may have real consequences.',
    options:[
      choice('hard-no','Hard no — I do not want a substantial obligation',{routeLimits:{serviceObligation:{max:20}},occupationLimits:{serviceObligation:{max:20}}}),
      choice('prefer-low','I prefer fewer strings attached',{routePreferences:{serviceObligation:{target:0,weight:4}},occupationPreferences:{serviceObligation:{target:0,weight:3}}}),
      choice('open','I will accept an obligation if the bargain is good'),
      choice('comfortable','A structured commitment does not bother me',{routePreferences:{serviceObligation:{target:65,weight:1}}})
    ]
  },
  {
    id:'human-contact',phase:'kill-list',type:'choice',
    prompt:'How much regular patient, customer, or public interaction can you tolerate?',
    context:'Think about the ordinary workday, not whether you can be polite for an interview.',
    options:[
      choice('hard-low','Very little — eliminate heavily people-facing work',{occupationLimits:{humanContact:{max:25}}}),
      choice('prefer-low','I strongly prefer lower-contact work',{occupationPreferences:{humanContact:{target:0,weight:5}}}),
      choice('moderate','Some interaction is fine',{occupationPreferences:{humanContact:{target:45,weight:2}}}),
      choice('high','I like working directly with people',{occupationPreferences:{humanContact:{target:90,weight:3}}})
    ]
  },
  {
    id:'physical-work',phase:'kill-list',type:'choice',
    prompt:'How much physical work do you want in an ordinary day?',
    context:'Standing, lifting, climbing, tools, outdoor environments, shop floors, and field work count here.',
    options:[
      choice('hard-low','Very little — eliminate physically demanding work',{occupationLimits:{physicalIntensity:{max:25}}}),
      choice('prefer-low','I prefer mostly desk / light physical work',{occupationPreferences:{physicalIntensity:{target:0,weight:4}}}),
      choice('mixed','A mix of physical and desk work sounds good',{occupationPreferences:{physicalIntensity:{target:50,weight:2}}}),
      choice('high','I like hands-on physical work',{occupationPreferences:{physicalIntensity:{target:85,weight:3}}})
    ]
  },
  {
    id:'acute-pressure',phase:'kill-list',type:'choice',
    prompt:'How do you feel about situations where something serious is going wrong right now?',
    context:'This is acute/emergency pressure, not ordinary accountability for accurate work.',
    options:[
      choice('hard-low','I want to avoid emergency / acute-pressure work',{occupationLimits:{acutePressure:{max:35}}}),
      choice('prefer-low','I strongly prefer deliberate, structured pressure',{occupationPreferences:{acutePressure:{target:0,weight:5}}}),
      choice('moderate','Some urgent situations are fine',{occupationPreferences:{acutePressure:{target:50,weight:2}}}),
      choice('high','I am comfortable being the person who acts under pressure',{occupationPreferences:{acutePressure:{target:90,weight:3}}})
    ]
  },
  {
    id:'schedule',phase:'kill-list',type:'choice',
    prompt:'How much shift work, nights, weekends, travel, or on-call duty will you tolerate?',
    context:'Some careers pay partly because somebody has to cover inconvenient hours.',
    options:[
      choice('hard-low','I need a mostly predictable daytime schedule',{occupationLimits:{scheduleBurden:{max:35}}}),
      choice('prefer-low','I strongly prefer predictable hours',{occupationPreferences:{scheduleBurden:{target:0,weight:4}}}),
      choice('flexible','I can tolerate some schedule pain',{occupationPreferences:{scheduleBurden:{target:45,weight:1}}}),
      choice('open','Schedule is not a major concern')
    ]
  },
  {
    id:'remote',phase:'tradeoffs',type:'choice',
    prompt:'How important is eventually being able to work remotely or with strong location flexibility?',
    context:'“Eventually” matters. Entry-level remote work is much less certain than long-term remote compatibility.',
    options:[
      choice('required','This is close to a requirement',{occupationLimits:{remotePotential:{min:70}},occupationPreferences:{remotePotential:{target:100,weight:5}}}),
      choice('important','Very important, but not an absolute veto',{occupationPreferences:{remotePotential:{target:100,weight:5}}}),
      choice('nice','Nice to have',{occupationPreferences:{remotePotential:{target:100,weight:2}}}),
      choice('onsite-fine','I am fine building my career onsite',{occupationPreferences:{remotePotential:{target:20,weight:1}}})
    ]
  },
  {
    id:'income-ceiling',phase:'tradeoffs',type:'choice',
    prompt:'How much do you care about the mature income ceiling?',
    context:'A higher ceiling can require more school, harder entry, more risk, or a longer runway.',
    options:[
      choice('maximize','A lot — I want substantial long-term upside',{occupationPreferences:{matureIncome:{target:100,weight:5}}}),
      choice('strong','Important, but not at any cost',{occupationPreferences:{matureIncome:{target:100,weight:3}}}),
      choice('enough','A solid comfortable income is enough',{occupationPreferences:{matureIncome:{target:70,weight:2}}}),
      choice('neutral','Not a major differentiator')
    ]
  },
  {
    id:'entry-certainty',phase:'tradeoffs',type:'choice',
    prompt:'How much do you value a clear first-job on-ramp?',
    context:'Some credentials map directly to a job. Other degrees create broad capability but require internships, networking, portfolios, or experience to convert.',
    options:[
      choice('critical','Very important — I want a defined on-ramp',{routePreferences:{credentialSpecificity:{target:100,weight:4}},occupationPreferences:{entryReliability:{target:100,weight:5},credentialMoat:{target:100,weight:3}}}),
      choice('important','Important, but I can build experience',{routePreferences:{credentialSpecificity:{target:100,weight:2}},occupationPreferences:{entryReliability:{target:100,weight:3}}}),
      choice('broad','I prefer broad optionality even if the first job is less automatic',{occupationPreferences:{exitOptions:{target:100,weight:4}}}),
      choice('neutral','Not sure')
    ]
  },
  {
    id:'market-depth',phase:'tradeoffs',type:'choice',
    prompt:'Would you rather have a deep job market or accept a smaller specialty for a better fit?',
    context:'Growth percentage is not the same thing as the number of actual chairs in the labor market.',
    options:[
      choice('deep','I strongly prefer a large, deep labor market',{occupationPreferences:{marketDepth:{target:100,weight:5},geographicPortability:{target:100,weight:3}}}),
      choice('balanced','Market depth matters, but specialty is okay',{occupationPreferences:{marketDepth:{target:100,weight:2}}}),
      choice('specialty','I can accept a small specialty if I really like the work'),
      choice('local','I care more about strong Central NC opportunity',{occupationPreferences:{localStrength:{target:100,weight:5}}})
    ]
  }
]);

export const SIEVE_QUESTION_BY_ID = Object.freeze(Object.fromEntries(SIEVE_QUESTIONS.map(q=>[q.id,q])));

function mergeDimensionPatch(target,key,patch) {
  if (!patch?.[key]) return;
  target[key] = {...(target[key] || {}),...patch[key]};
}

function mergePatch(input,patch={}) {
  for (const key of ['routePreferences','occupationPreferences','routeLimits','occupationLimits']) {
    if (!patch[key]) continue;
    input[key] ||= {};
    for (const [dimension,value] of Object.entries(patch[key])) mergeDimensionPatch(input[key],dimension,{[dimension]:value});
  }
}

export function buildDecisionProfileFromAnswers(answers = {}) {
  const input={};

  for (const question of SIEVE_QUESTIONS) {
    const answer=answers[question.id];
    if (answer == null) continue;

    if (question.type === 'route-multiselect') {
      const selected=answer === 'all' ? [...ROUTE_TYPES] : answer;
      if (!Array.isArray(selected)) throw new Error(`${question.id} answer must be an array of route types or "all"`);
      input.allowedRouteTypes=[...new Set(selected)];
      continue;
    }

    const option=question.options.find(item=>item.id===answer);
    if (!option) throw new Error(`Unknown answer ${answer} for ${question.id}`);
    mergePatch(input,option.patch);
  }

  return createDecisionProfile(input);
}

export function describeSieveAnswers(answers = {}) {
  const rows=[];
  for (const question of SIEVE_QUESTIONS) {
    const answer=answers[question.id];
    if (answer == null) continue;
    if (question.type === 'route-multiselect') {
      const selected=answer === 'all' ? [...ROUTE_TYPES] : answer;
      const labels=selected.map(id=>ROUTE_SIEVE_OPTIONS.find(x=>x.id===id)?.label || id);
      rows.push({questionId:question.id,prompt:question.prompt,answer:labels.join(' · ')});
      continue;
    }
    const option=question.options.find(item=>item.id===answer);
    rows.push({questionId:question.id,prompt:question.prompt,answer:option?.label || String(answer)});
  }
  return rows;
}
