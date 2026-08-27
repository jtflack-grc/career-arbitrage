import { EDUCATION_CATALOG } from './education-catalog.js';
import { projectPrograms } from './program-projector.js';
import { scoreInterestTags } from './interests.js';

const RELATIONSHIP_WEIGHT=Object.freeze({direct:100,strong:88,adjacent:68,exploratory:48});

const rx=(...values)=>values.map(value=>new RegExp(value,'i'));

// These rules answer one narrow question: "Is this education/training option a
// defensible way toward THIS occupation?" Interest can rank eligible options,
// but it can never make an unrelated major eligible.
export const CAREER_EDUCATION_RULES=Object.freeze({
  'aircraft-mechanic':[
    {relationship:'direct',families:['aviation'],include:rx('aviation systems','airframe','powerplant','aircraft maintenance','a&p')},
    {relationship:'strong',families:['aviation'],include:rx('aviation','aircraft')}
  ],
  'avionics-technician':[
    {relationship:'direct',families:['aviation'],include:rx('avionics','aviation electronics')},
    {relationship:'strong',families:['aviation','engineering-technology'],include:rx('electronics','electrical','aviation systems')}
  ],
  'industrial-machinery-mechanic':[
    {relationship:'direct',families:['advanced-manufacturing'],include:rx('industrial systems','industrial maintenance','mechatronics','advanced manufacturing')},
    {relationship:'strong',families:['engineering-technology','skilled-trades'],include:rx('mechanical engineering technology','electrical systems','electronics engineering technology')}
  ],
  'mechatronics-technician':[
    {relationship:'direct',families:['advanced-manufacturing'],include:rx('mechatronics')},
    {relationship:'strong',families:['advanced-manufacturing','engineering-technology'],include:rx('industrial systems','electronics engineering technology','mechanical engineering technology','automation')}
  ],
  electrician:[
    {relationship:'direct',families:['skilled-trades'],include:rx('electrical systems','electrician','electrical technology')}
  ],
  'hvac-technician':[
    {relationship:'direct',families:['skilled-trades'],include:rx('hvac','hvacr','air conditioning','heating.*refrigeration','refrigeration technology')}
  ],
  'electrical-engineer':[
    {relationship:'direct',families:['engineering'],include:rx('^electrical engineering$','electrical and computer engineering')},
    {relationship:'strong',families:['engineering'],include:rx('computer engineering','^engineering$')},
    {relationship:'adjacent',families:['engineering-technology'],include:rx('electronics engineering technology','electrical engineering technology')}
  ],
  'industrial-engineer':[
    {relationship:'direct',families:['engineering'],include:rx('industrial.*engineering','systems engineering')},
    {relationship:'strong',families:['engineering','engineering-technology'],include:rx('manufacturing engineering','engineering management','advanced manufacturing','industrial technology')}
  ],
  'software-developer':[
    {relationship:'direct',families:['computing'],include:rx('computer science','software','programming')},
    {relationship:'strong',families:['computing'],include:rx('web technologies','information technology')},
    {relationship:'adjacent',families:['business-computing'],include:rx('information systems','business information technology')}
  ],
  'information-security-analyst':[
    {relationship:'direct',families:['computing'],include:rx('cybersecurity','cyber security','cyber operations','network security')},
    {relationship:'strong',families:['computing'],include:rx('information technology','computer science','network')},
    {relationship:'adjacent',families:['business-computing'],include:rx('information systems','business information technology')}
  ],
  'computer-systems-analyst':[
    {relationship:'direct',families:['business-computing','computing'],include:rx('information systems','information technology','business information technology')},
    {relationship:'strong',families:['computing','business-data'],include:rx('computer science','business analytics','data analytics')}
  ],
  'data-scientist':[
    {relationship:'direct',families:['computing-data','business-data','computing'],include:rx('data science','data analytics','data reporting','analytics')},
    {relationship:'strong',families:['computing','mathematics'],include:rx('artificial intelligence','computer science','statistics','mathematics')}
  ],
  'accountant-auditor':[
    {relationship:'direct',families:['business'],include:rx('accounting')}
  ],
  logistician:[
    {relationship:'direct',families:['business-logistics'],include:rx('supply chain','logistics')},
    {relationship:'strong',families:['business','transportation'],include:rx('operations management','transportation.*logistics')}
  ],
  'clinical-lab-technologist':[
    {relationship:'direct',families:['healthcare-technical'],include:rx('medical laboratory','clinical laboratory')},
    {relationship:'adjacent',families:['life-sciences'],include:rx('biotechnology','biology','biochemistry')}
  ],
  'health-information-technologist':[
    {relationship:'direct',families:['healthcare-technical'],include:rx('health information')},
    {relationship:'adjacent',families:['healthcare','business-computing'],include:rx('healthcare informatics','health informatics')}
  ],
  'medical-equipment-repairer':[
    {relationship:'direct',families:['engineering-technology','healthcare-technical'],include:rx('biomedical equipment','biomedical technology')},
    {relationship:'strong',families:['engineering-technology','engineering'],include:rx('electronics engineering technology','biomedical engineering','electrical engineering technology')}
  ],
  'registered-nurse':[
    {relationship:'direct',families:['healthcare'],include:rx('nursing','associate degree nursing','practical nursing')}
  ],
  'public-safety-telecommunicator':[
    {relationship:'strong',families:['public-safety'],include:rx('emergency management','public safety administration','criminal justice')}
  ],
  'police-patrol-officer':[
    {relationship:'direct',families:['public-safety'],include:rx('basic law enforcement','blet','law enforcement')},
    {relationship:'strong',families:['public-safety'],include:rx('criminal justice')},
    {relationship:'adjacent',families:['public-safety'],include:rx('public safety administration')}
  ],
  'heavy-truck-driver':[
    {relationship:'direct',families:['transportation'],include:rx('truck driver','commercial driver','cdl')}
  ],
  machinist:[
    {relationship:'direct',families:['advanced-manufacturing'],include:rx('computer-integrated machining','machining','cnc')},
    {relationship:'strong',families:['advanced-manufacturing'],include:rx('manufacturing technology','advanced manufacturing')}
  ]
});

function normalizedKey(institution,name){
  return `${institution}::${name}`.toLowerCase().replace(/[^a-z0-9:]+/g,' ');
}

function matchRule(option,rules){
  for(const rule of rules||[]){
    if(rule.families?.length && !rule.families.includes(option.family)) continue;
    if(rule.exclude?.some(pattern=>pattern.test(option.name))) continue;
    if(rule.include?.length && !rule.include.some(pattern=>pattern.test(option.name))) continue;
    return rule;
  }
  return null;
}

function catalogRowsForOccupation(occupationRow,evaluation,interestProfile,{limit=5}={}){
  const allowedTypes=new Set(evaluation.profile.allowedRouteTypes||[]);
  const survivingTypes=new Set(evaluation.routes.surviving.map(row=>row.type));
  const rules=CAREER_EDUCATION_RULES[occupationRow.id]||[];
  const rows=[];

  for(const option of EDUCATION_CATALOG){
    if(!allowedTypes.has(option.routeType)||!survivingTypes.has(option.routeType)) continue;
    const rule=matchRule(option,rules);
    if(!rule) continue;
    const interestScore=scoreInterestTags(option.interestTags,interestProfile);
    const relationshipBase=RELATIONSHIP_WEIGHT[rule.relationship]??50;
    const localBonus=option.scope==='triad-core'?8:0;
    const interestBonus=interestScore==null?0:Math.round((interestScore-50)*.12);
    const score=Math.max(0,Math.min(100,relationshipBase+localBonus+interestBonus));
    rows.push({
      kind:'catalog',id:option.id,institution:option.institution,name:option.name,
      award:option.award,routeType:option.routeType,scope:option.scope,
      relationship:rule.relationship,score,interestScore,sourceIds:option.sourceIds||[],option
    });
  }

  return rows.sort((a,b)=>b.score-a.score||(a.scope===b.scope?0:a.scope==='triad-core'?-1:1)||a.institution.localeCompare(b.institution)||a.name.localeCompare(b.name)).slice(0,limit);
}

export function projectCareerPaths(evaluation,interestProfile,{occupationLimit=6,maxPathsPerOccupation=5,maxDirectPerOccupation=3}={}){
  const occupationRows=evaluation.occupations.surviving.slice(0,occupationLimit);
  const ids=occupationRows.map(row=>row.id);
  const direct=projectPrograms(evaluation,{limit:100,occupationIds:ids,maxPerOccupation:maxDirectPerOccupation});
  const directByOccupation=new Map(ids.map(id=>[id,[]]));

  for(const row of direct){
    const id=row.bestOccupation?.occupationId;
    if(!id||!directByOccupation.has(id)) continue;
    directByOccupation.get(id).push({
      kind:'mapped',id:row.id,institution:row.institution,name:row.name,
      award:row.credential,routeType:row.routeType,scope:'mapped',
      relationship:row.bestOccupation.relationship,score:row.alignmentScore,
      sourceIds:row.program?.sourceIds||[],programRow:row
    });
  }

  return occupationRows.map((occupationRow,index)=>{
    const mapped=directByOccupation.get(occupationRow.id)||[];
    const seen=new Set(mapped.map(row=>normalizedKey(row.institution,row.name)));
    const catalog=catalogRowsForOccupation(occupationRow,evaluation,interestProfile,{limit:maxPathsPerOccupation*2})
      .filter(row=>!seen.has(normalizedKey(row.institution,row.name)));
    const paths=[...mapped,...catalog]
      .sort((a,b)=>{
        const ar=RELATIONSHIP_WEIGHT[a.relationship]??0,br=RELATIONSHIP_WEIGHT[b.relationship]??0;
        if(ar!==br)return br-ar;
        if(a.kind!==b.kind)return a.kind==='mapped'?-1:1;
        return (b.score??0)-(a.score??0)||a.institution.localeCompare(b.institution)||a.name.localeCompare(b.name);
      })
      .slice(0,maxPathsPerOccupation);
    return {rank:index+1,occupationRow,occupation:occupationRow.occupation,paths};
  });
}

export function careerEducationRuleCoverage(){
  return Object.keys(CAREER_EDUCATION_RULES).length;
}
