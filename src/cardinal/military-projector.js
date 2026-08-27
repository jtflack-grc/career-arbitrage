import { MILITARY_SPECIALTIES } from './military-specialties.js';
import { scoreInterestTags } from './interests.js';

const FAMILY_TAGS=Object.freeze({
  combat:['build','lead'], 'combat-engineering':['build','lead'], 'air-defense':['build','analyze'],
  'aviation-maintenance':['build','analyze'], 'aviation-flight':['build','lead'], 'aviation-operations':['organize','analyze'],
  'aviation-intelligence':['analyze','organize'], 'aviation-logistics':['organize','build'], 'aviation-rescue':['help','build'],
  cyber:['analyze','build'], 'cyber-it':['analyze','build'], 'cyber-intelligence':['analyze'], 'cyber-engineering':['analyze','create'],
  intelligence:['analyze','organize'], 'intelligence-language':['analyze','communicate'], 'intelligence-electronics':['analyze','build'],
  'science-intelligence':['analyze'], 'space-operations':['analyze','organize'],
  'engineering-construction':['build','analyze'], engineering:['build','analyze'], 'engineering-cyber':['build','analyze'], 'engineering-aviation':['build','analyze'],
  'electronics-maintenance':['build','analyze'], 'electrical-maintenance':['build','analyze'], maintenance:['build','analyze'], 'maintenance-electrical':['build','analyze'],
  'machining-welding':['build'], 'ship-engineering':['build','analyze'], navigation:['analyze','organize'],
  logistics:['organize','analyze'], 'transportation-logistics':['organize','build'], operations:['organize','analyze'], 'operations-emergency':['organize','lead'], 'operations-leadership':['lead','organize'],
  'finance-admin':['organize','analyze'], 'business-acquisition':['organize','lead'], 'business-service':['organize','help'],
  legal:['communicate','organize'], communications:['communicate','create'],
  'law-enforcement':['help','lead'], 'law-enforcement-support':['build','lead'], 'public-safety':['help','lead'], 'public-safety-aviation':['help','build'], 'environmental-public-safety':['analyze','help'],
  'healthcare-technical':['help','analyze'], 'healthcare-clinical':['help'], 'healthcare-special-operations':['help','build'],
  'food-service':['help','organize'], 'special-operations':['build','lead'], 'aviation-special-operations':['build','help'], 'aviation-support':['build','organize'], 'maritime-operations':['build','organize']
});

function componentEligible(specialty,allowedRouteTypes){
  const active=allowedRouteTypes.includes('active-duty-military');
  const reserve=allowedRouteTypes.includes('guard-reserve');
  if(specialty.rankPath==='officer') return allowedRouteTypes.includes('rotc');
  if(specialty.rankPath==='later-service') return false;
  if(active && specialty.components.includes('active-duty')) return true;
  if(reserve && specialty.components.some(x=>['reserve','national-guard','air-force-reserve','air-national-guard'].includes(x))) return true;
  return false;
}

export function projectMilitarySpecialties(cardinalEvaluation,interestProfile,{limit=24,service=null}={}){
  const allowed=cardinalEvaluation.profile.allowedRouteTypes || [];
  if(!allowed.some(x=>['active-duty-military','guard-reserve','rotc'].includes(x))) return [];
  const occ=new Map(cardinalEvaluation.occupations.surviving.map(r=>[r.id,r.score]));
  const rows=[];
  for(const specialty of MILITARY_SPECIALTIES){
    if(service && specialty.service!==service) continue;
    if(!componentEligible(specialty,allowed)) continue;
    const tags=FAMILY_TAGS[specialty.family] || [];
    const interestScore=scoreInterestTags(tags,interestProfile);
    const occupationScores=(specialty.occupationIds||[]).map(id=>occ.get(id)).filter(Number.isFinite);
    const occupationScore=occupationScores.length?Math.max(...occupationScores):null;
    let score=null;
    if(interestScore!=null && occupationScore!=null) score=Math.round(interestScore*.58+occupationScore*.42);
    else score=interestScore??occupationScore??50;
    rows.push({...specialty,interestTags:tags,interestScore,occupationScore,score});
  }
  return rows.sort((a,b)=>b.score-a.score || a.service.localeCompare(b.service) || a.family.localeCompare(b.family) || a.title.localeCompare(b.title)).slice(0,limit);
}

export function militaryCatalogStats(){
  const byService={};
  for(const row of MILITARY_SPECIALTIES){
    byService[row.service]||={total:0,enlisted:0,officer:0,laterService:0};
    byService[row.service].total++;
    if(row.rankPath==='officer') byService[row.service].officer++;
    else if(row.rankPath==='later-service') byService[row.service].laterService++;
    else byService[row.service].enlisted++;
  }
  return {total:MILITARY_SPECIALTIES.length,byService};
}
