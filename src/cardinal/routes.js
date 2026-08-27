import { occupationRef } from './schema.js';

export const ROUTES = Object.freeze([
  {
    id:'public-four-year-commuter', type:'four-year-college', name:'Public four-year college - live at home / commute',
    description:'Low-housing-cost bachelor route when a nearby public university and suitable major are available.',
    tradeoffs:{costBurden:38,timeToIncome:62,earnWhileLearning:18,locationControl:88,serviceObligation:0,credentialSpecificity:55},
    occupationRefs:[], sourceIds:['ncat-majors','uncg-isscm','uncg-accounting','charlotte-programs']
  },
  {
    id:'public-four-year-residential', type:'four-year-college', name:'Public four-year college - residential',
    description:'Traditional public-university route with higher living cost but broader campus access and geographic choice.',
    tradeoffs:{costBurden:60,timeToIncome:62,earnWhileLearning:18,locationControl:78,serviceObligation:0,credentialSpecificity:55},
    occupationRefs:[], sourceIds:['ncat-majors','charlotte-programs']
  },
  {
    id:'community-college-career', type:'community-college', name:'Community college - direct career credential',
    description:'Low-cost certificate, diploma, or AAS designed to create a recognizable first occupational capability.',
    tradeoffs:{costBurden:18,timeToIncome:28,earnWhileLearning:30,locationControl:94,serviceObligation:0,credentialSpecificity:86},
    occupationRefs:[occupationRef('aircraft-mechanic','exploratory'),occupationRef('mechatronics-technician','exploratory'),occupationRef('clinical-lab-technologist','exploratory')],
    sourceIds:['gtcc-aviation','gtcc-mechatronics','forsyth-catalog']
  },
  {
    id:'community-college-transfer', type:'community-college', name:'Community college - AA/AS transfer',
    description:'Use low-cost community-college credits to reduce the price of a later bachelor degree; not itself a direct occupation credential.',
    tradeoffs:{costBurden:14,timeToIncome:58,earnWhileLearning:22,locationControl:96,serviceObligation:0,credentialSpecificity:18},
    occupationRefs:[], sourceIds:['nces-cip-soc']
  },
  {
    id:'gap-youth-apprenticeship', type:'apprenticeship', name:'Guilford Apprenticeship Partners - earn and learn',
    description:'Employer-selected youth apprenticeship combining paid work, progressive wages, and covered GTCC education.',
    tradeoffs:{costBurden:4,timeToIncome:2,earnWhileLearning:100,locationControl:84,serviceObligation:42,credentialSpecificity:90},
    occupationRefs:[occupationRef('electrician','direct'),occupationRef('mechatronics-technician','direct'),occupationRef('industrial-machinery-mechanic','direct')],
    sourceIds:['gap']
  },
  {
    id:'fame-advanced-manufacturing', type:'apprenticeship', name:'NC FAME - advanced manufacturing technician',
    description:'Two-year employer-sponsored mechatronics AAS with paid work integrated throughout the program.',
    tradeoffs:{costBurden:6,timeToIncome:3,earnWhileLearning:100,locationControl:82,serviceObligation:38,credentialSpecificity:94},
    occupationRefs:[occupationRef('mechatronics-technician','direct'),occupationRef('industrial-machinery-mechanic','direct')],
    sourceIds:['gtcc-fame','toyota-nc']
  },
  {
    id:'active-duty-technical-service', type:'active-duty-military', name:'Active-duty military - technical specialty',
    description:'Immediate paid service with military technical training, benefits, and potential later education benefits. Specialty, branch, contract, qualification, and civilian transferability must be evaluated separately.',
    tradeoffs:{costBurden:0,timeToIncome:0,earnWhileLearning:100,locationControl:12,serviceObligation:100,credentialSpecificity:72},
    occupationRefs:[occupationRef('avionics-technician','adjacent','Some aviation/electronics specialties transfer strongly'),occupationRef('information-security-analyst','adjacent','Some cyber specialties create relevant experience'),occupationRef('logistician','adjacent','Logistics specialties can create civilian-relevant experience')],
    sourceIds:['dfas-2026','va-gi-bill']
  },
  {
    id:'guard-reserve-college', type:'guard-reserve', name:'Guard / Reserve + civilian college or work',
    description:'Combine civilian education/work with part-time military service, training, potential tuition assistance, and activation risk.',
    tradeoffs:{costBurden:16,timeToIncome:25,earnWhileLearning:62,locationControl:68,serviceObligation:86,credentialSpecificity:58},
    occupationRefs:[], sourceIds:['nc-guard-ta','dfas-2026']
  },
  {
    id:'rotc-officer', type:'rotc', name:'ROTC / officer commissioning route',
    description:'Complete a bachelor degree while training for a later commissioned-service obligation; scholarship and benefit structures vary.',
    tradeoffs:{costBurden:30,timeToIncome:58,earnWhileLearning:34,locationControl:24,serviceObligation:96,credentialSpecificity:60},
    occupationRefs:[], sourceIds:['dfas-2026']
  },
  {
    id:'direct-work-local', type:'direct-work', name:'Work immediately after high school',
    description:'Enter the labor market immediately; quality varies enormously based on employer, training pathway, benefits, wage progression, and whether the job builds a transferable skill.',
    tradeoffs:{costBurden:0,timeToIncome:0,earnWhileLearning:100,locationControl:90,serviceObligation:8,credentialSpecificity:24},
    occupationRefs:[occupationRef('heavy-truck-driver','exploratory'),occupationRef('public-safety-telecommunicator','exploratory'),occupationRef('industrial-machinery-mechanic','exploratory')],
    sourceIds:['nc-proj-2024-34']
  },
  {
    id:'americorps-nccc', type:'structured-service-gap', name:'AmeriCorps NCCC / structured service year',
    description:'Time-bounded national service with structured work, living support, training, and an education award; intended as a purposeful service/exploration route rather than an unstructured pause.',
    tradeoffs:{costBurden:3,timeToIncome:28,earnWhileLearning:46,locationControl:28,serviceObligation:60,credentialSpecificity:18},
    occupationRefs:[], sourceIds:['americorps-nccc']
  }
]);

export const ROUTE_BY_ID = Object.freeze(Object.fromEntries(ROUTES.map(item => [item.id, item])));
