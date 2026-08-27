import { PROGRAMS } from './programs.js';

const RELATIONSHIP_WEIGHT = Object.freeze({direct:1,strong:.9,adjacent:.7,exploratory:.5});

export function projectPrograms(cardinalEvaluation,{limit=12,occupationIds=null,maxPerOccupation=2}={}) {
  const requestedOccupations=occupationIds ? new Set(occupationIds) : null;
  const occupationScores=new Map(
    cardinalEvaluation.occupations.surviving
      .filter(row=>!requestedOccupations || requestedOccupations.has(row.id))
      .map((row,index)=>[row.id,{...row,rank:index+1}])
  );
  const allowedTypes=new Set(cardinalEvaluation.profile.allowedRouteTypes);
  const survivingRouteTypes=new Set(cardinalEvaluation.routes.surviving.map(row=>row.type));
  const rows=[];

  for (const program of PROGRAMS) {
    // Route choice is a gate, not a weak preference. A four-year program must never
    // appear when four-year college was not kept open, and the same rule applies to
    // military, apprenticeship, direct-work, and community-college pathways.
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

    // When projecting from the visible occupation reveal, do not backfill the panel
    // with unrelated gateway degrees merely because they share an allowed route type.
    if (requestedOccupations && !links.length) continue;
    if (!links.length && (program.occupationRefs || []).length) continue;

    links.sort((a,b)=>a.occupationRank-b.occupationRank || b.relationshipWeight-a.relationshipWeight || b.alignment-a.alignment);
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

  const sorted=rows.sort((a,b)=>{
    const ar=a.bestOccupation?.occupationRank ?? Number.MAX_SAFE_INTEGER;
    const br=b.bestOccupation?.occupationRank ?? Number.MAX_SAFE_INTEGER;
    if (ar!==br) return ar-br;
    const aw=a.bestOccupation?.relationshipWeight ?? 0;
    const bw=b.bestOccupation?.relationshipWeight ?? 0;
    if (aw!==bw) return bw-aw;
    if (a.alignmentScore == null && b.alignmentScore == null) return (b.onRampClarity ?? 0)-(a.onRampClarity ?? 0) || a.name.localeCompare(b.name);
    if (a.alignmentScore == null) return 1;
    if (b.alignmentScore == null) return -1;
    return b.alignmentScore-a.alignmentScore || (b.onRampClarity ?? 0)-(a.onRampClarity ?? 0) || a.name.localeCompare(b.name);
  });

  if (!maxPerOccupation || maxPerOccupation<1) return sorted.slice(0,limit);

  const counts=new Map();
  const bounded=[];
  for (const row of sorted) {
    const occupationId=row.bestOccupation?.occupationId || '__gateway__';
    const count=counts.get(occupationId) || 0;
    if (count>=maxPerOccupation) continue;
    counts.set(occupationId,count+1);
    bounded.push(row);
    if (bounded.length>=limit) break;
  }
  return bounded;
}
