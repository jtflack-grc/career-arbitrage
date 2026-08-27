import { createDecisionProfile } from './decision-engine.js';

const option=(id,label,occupationPreferences={})=>({id,label,occupationPreferences});

export const TUESDAY_QUESTIONS=Object.freeze([
  {
    id:'tuesday-work-surface',
    prompt:'It is 10:15 on an ordinary Tuesday. Which work surface sounds least annoying?',
    options:[
      option('screen','A laptop, dashboards, code, models, documents, and systems',{remotePotential:{target:90,weight:2},physicalIntensity:{target:5,weight:2}}),
      option('equipment','Machines, tools, instruments, vehicles, panels, or physical systems',{physicalIntensity:{target:65,weight:3},remotePotential:{target:5,weight:1}}),
      option('people','A room, call, counter, classroom, or worksite where people need something from me',{humanContact:{target:80,weight:3}}),
      option('mixed','Some screen work, some physical systems, some people',{physicalIntensity:{target:40,weight:2},humanContact:{target:45,weight:2}})
    ]
  },
  {
    id:'tuesday-problem',
    prompt:'Something is wrong. Which version of “wrong” would you rather own?',
    options:[
      option('analyze','The numbers or system behavior do not make sense. I get time to investigate',{acutePressure:{target:20,weight:3}}),
      option('repair','A physical system is down and I need to diagnose and restore it',{physicalIntensity:{target:55,weight:2},acutePressure:{target:55,weight:2}}),
      option('urgent','A serious live situation needs a decision right now',{acutePressure:{target:90,weight:4}}),
      option('coordinate','Several teams or vendors are tangled up and I need to get the operation moving',{humanContact:{target:60,weight:2},acutePressure:{target:45,weight:2}})
    ]
  },
  {
    id:'tuesday-environment',
    prompt:'Where would you rather spend most ordinary workdays?',
    options:[
      option('flexible','Anywhere with a secure connection and a decent desk',{remotePotential:{target:100,weight:3}}),
      option('facility','A plant, airport, lab, hospital, shop, utility site, or technical facility',{remotePotential:{target:0,weight:2},physicalIntensity:{target:45,weight:2}}),
      option('office','A predictable office with coworkers nearby',{remotePotential:{target:35,weight:1},humanContact:{target:45,weight:1}}),
      option('field','Different sites, customers, equipment, or locations depending on the day',{physicalIntensity:{target:65,weight:2},scheduleBurden:{target:55,weight:1}})
    ]
  },
  {
    id:'tuesday-schedule',
    prompt:'Which schedule bargain sounds most acceptable?',
    options:[
      option('predictable','Mostly predictable weekday hours, even if that limits some options',{scheduleBurden:{target:10,weight:3}}),
      option('some-pain','Occasional nights, travel, weekends, or on-call for a stronger opportunity',{scheduleBurden:{target:45,weight:2}}),
      option('shift','Structured shifts are fine if I know the schedule',{scheduleBurden:{target:65,weight:2}}),
      option('whatever','I care more about the work/pay than the clock',{scheduleBurden:{target:70,weight:1}})
    ]
  },
  {
    id:'tuesday-skill-moat',
    prompt:'Five years from now, what would you rather be unusually good at?',
    options:[
      option('credential','A difficult licensed or technical craft that clearly separates me from beginners',{credentialMoat:{target:100,weight:3},entryReliability:{target:95,weight:2}}),
      option('systems','Understanding complicated systems well enough to move across several roles',{exitOptions:{target:100,weight:3},automationResilience:{target:90,weight:2}}),
      option('analysis','Turning messy information into decisions, models, or recommendations',{physicalIntensity:{target:5,weight:1},exitOptions:{target:90,weight:2}}),
      option('operations','Keeping a real operation working: people, equipment, schedule, quality, and flow',{humanContact:{target:50,weight:1},automationResilience:{target:90,weight:2},localStrength:{target:90,weight:1}})
    ]
  }
]);

function combinePreference(existing,incoming){
  if(!existing) return {...incoming};
  const weight=existing.weight+incoming.weight;
  if(weight<=0) return {target:incoming.target,weight:0};
  return {target:Math.round(((existing.target*existing.weight)+(incoming.target*incoming.weight))/weight),weight};
}

export function applyTuesdayAnswers(baseProfile,answers={}){
  const input={
    allowedRouteTypes:[...baseProfile.allowedRouteTypes],
    routePreferences:{...baseProfile.routePreferences},
    occupationPreferences:{...baseProfile.occupationPreferences},
    routeLimits:{...baseProfile.routeLimits},
    occupationLimits:{...baseProfile.occupationLimits}
  };
  for(const question of TUESDAY_QUESTIONS){
    const answer=answers[question.id];
    if(answer==null) continue;
    const selected=question.options.find(option=>option.id===answer);
    if(!selected) throw new Error(`Unknown answer ${answer} for ${question.id}`);
    for(const [key,pref] of Object.entries(selected.occupationPreferences||{})){
      input.occupationPreferences[key]=combinePreference(input.occupationPreferences[key],pref);
    }
  }
  return createDecisionProfile(input);
}
