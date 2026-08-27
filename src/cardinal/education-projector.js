import { EDUCATION_CATALOG } from './education-catalog.js';
import { scoreInterestTags } from './interests.js';

const OCCUPATION_FAMILY_HINTS=Object.freeze({
  'aerospace-aviation':['aviation','engineering','engineering-technology','advanced-manufacturing'],
  'advanced-manufacturing':['advanced-manufacturing','engineering','engineering-technology','skilled-trades'],
  'skilled-trades':['skilled-trades','advanced-manufacturing','construction-business'],
  engineering:['engineering','engineering-technology','design-engineering'],
  'computing-data':['computing','computing-data','business-computing','business-data'],
  'business-finance-logistics':['business','business-data','business-logistics','business-computing'],
  'healthcare-technical':['healthcare-technical','healthcare','life-sciences'],
  'healthcare-clinical':['healthcare','public-safety-healthcare'],
  'public-service':['public-safety','public-safety-social-science','social-service'],
  'transportation-logistics':['transportation','business-logistics']
});

function familyAffinity(option,evaluation){
  const top=evaluation.occupations.surviving.slice(0,8);
  let best=0;
  for(let i=0;i<top.length;i++){
    const row=top[i];
    const allowed=OCCUPATION_FAMILY_HINTS[row.occupation.family]||[];
    if(allowed.some(prefix=>option.family===prefix||option.family.startsWith(`${prefix}-`))) best=Math.max(best,100-i*8);
  }
  return best||null;
}

export function projectEducationOptions(cardinalEvaluation,interestProfile,{limit=24,scope='all'}={}){
  const allowed=new Set(cardinalEvaluation.profile.allowedRouteTypes||[]);
  const rows=[];
  for(const option of EDUCATION_CATALOG){
    if(!allowed.has(option.routeType)) continue;
    if(scope!=='all' && option.scope!==scope) continue;
    const interestScore=scoreInterestTags(option.interestTags,interestProfile);
    const occupationAffinity=familyAffinity(option,cardinalEvaluation);
    const localBonus=option.scope==='triad-core'?6:0;
    let score;
    if(interestScore!=null && occupationAffinity!=null) score=Math.round(interestScore*.62+occupationAffinity*.38+localBonus);
    else score=Math.round((interestScore??occupationAffinity??50)+localBonus);
    score=Math.min(100,score);
    rows.push({...option,interestScore,occupationAffinity,score});
  }
  return rows.sort((a,b)=>b.score-a.score || (a.scope===b.scope?0:a.scope==='triad-core'?-1:1) || a.institution.localeCompare(b.institution) || a.name.localeCompare(b.name)).slice(0,limit);
}

export function educationCatalogStats(){
  const byInstitution={},byRoute={};
  for(const row of EDUCATION_CATALOG){
    byInstitution[row.institution]=(byInstitution[row.institution]||0)+1;
    byRoute[row.routeType]=(byRoute[row.routeType]||0)+1;
  }
  return {total:EDUCATION_CATALOG.length,byInstitution,byRoute};
}
