import { PROGRAMS } from './programs.js';

const RELATIONSHIP_WEIGHT = Object.freeze({direct:1,strong:.9,adjacent:.7,exploratory:.5});

export function projectPrograms(cardinalEvaluation,{limit=12}={}) {
  const occupationScores=new Map(cardinalEvaluation.occupations.surviving.map((row,index)=>[row.id,{...row,rank:index+1}]));
  const allowedTypes=new Set(cardinalEvaluation.profile.allowedRouteTypes);
  const survivingRouteTypes=new Set(cardinalEvaluation.routes.surviving.map(row=>row.type));
  const rows=[];

  for (const program of PROGRAMS) {
    if (!allowedTypes.has(program.routeType)) continue;
    if (!survivingRouteTypes.has(program.routeType)) continue;

    const links=[];
    for (const ref of program.occupationRefs || []) {
      const occupation=occupationScores.get(ref.id);
      if (!occupation || occupation.score == null) continue;
      const relationshipWeight=RELATIONSHIP_WEIGHT[ref.relationship] ?? .5;
      links.push({
        occupationId:ref.id,
        occupationName:occupation.name,
        occupationRank:occupation.rank,
        occupationScore:occupation.score,
        relationship:ref.relationship,
        relationshipWeight,
        note:ref.note || '',
        alignment:Math.round(occupation.score*relationshipWeight)
      });
    }

    if (!links.length && (program.occupationRefs || []).length) continue;

    links.sort((a,b)=>b.alignment-a.alignment || a.occupationRank-b.occupationRank);
    const best=links[0] || null;
    rows.push({
      id:program.id,
      institution:program.institution,
      name:program.name,
      credential:program.credential,
      routeType:program.routeType,
      durationMonths:program.durationMonths ?? null,
      onRampClarity:program.onRampClarity ?? null,
      admissionGate:program.admissionGate ?? '',
      earnWhileLearning:Boolean(program.earnWhileLearning),
      alignmentScore:best?.alignment ?? null,
      bestOccupation:best,
      occupationLinks:links,
      program
    });
  }

  return rows
    .sort((a,b)=>{
      if (a.alignmentScore == null && b.alignmentScore == null) return (b.onRampClarity ?? 0)-(a.onRampClarity ?? 0) || a.name.localeCompare(b.name);
      if (a.alignmentScore == null) return 1;
      if (b.alignmentScore == null) return -1;
      return b.alignmentScore-a.alignmentScore || (b.onRampClarity ?? 0)-(a.onRampClarity ?? 0) || a.name.localeCompare(b.name);
    })
    .slice(0,limit);
}
