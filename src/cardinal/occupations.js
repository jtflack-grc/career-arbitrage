import { blankDimensions } from './schema.js';

const O = (record) => ({
  localEvidence: null,
  nationalEvidence: null,
  credential: null,
  notes: [],
  ...record,
  dimensions: blankDimensions(record.dimensions || {})
});

// Dimension values are editorial 0–100 descriptors for preference matching.
// They are deliberately separate from sourced wage/employment facts and are not a quality score.
export const OCCUPATIONS = Object.freeze([
  O({
    id:'aircraft-mechanic', soc:'49-3011', name:'Aircraft Mechanic / A&P Technician', family:'aerospace-aviation',
    clusterIds:['pti-aerospace'], typicalEntry:'Postsecondary FAA-approved training or qualifying experience', credential:'FAA Airframe & Powerplant certification',
    localEvidence:{metro:'Greensboro-High Point', medianWage:64520, asOf:'2025-05'},
    nationalEvidence:{employment:160800, annualOpenings:13100, note:'Aircraft mechanics and avionics combined in cited OOH family.'},
    dimensions:{earlyIncome:72,matureIncome:64,entryReliability:90,marketDepth:70,localStrength:96,credentialMoat:94,educationCost:24,timeToIncome:28,earnWhileTraining:30,remotePotential:0,humanContact:25,physicalIntensity:72,acutePressure:45,scheduleBurden:62,geographicPortability:76,automationResilience:86,exitOptions:68,selfEmployment:45,serviceObligation:0},
    sourceIds:['bls-aircraft','bls-gso-2025','gtcc-aviation','pti-aerospace']
  }),
  O({
    id:'avionics-technician', soc:'49-2091', name:'Avionics Technician', family:'aerospace-aviation',
    clusterIds:['pti-aerospace'], typicalEntry:'Postsecondary avionics/electronics training; employer/FAA requirements vary',
    localEvidence:{metro:'Greensboro-High Point', note:'Region has unusually high historical occupational concentration.'},
    nationalEvidence:{annualOpenings:13100, growthPct:8, note:'Openings cited with aircraft/avionics family; growth is avionics-specific.'},
    dimensions:{earlyIncome:70,matureIncome:67,entryReliability:84,marketDepth:54,localStrength:97,credentialMoat:83,educationCost:25,timeToIncome:30,earnWhileTraining:32,remotePotential:0,humanContact:20,physicalIntensity:55,acutePressure:42,scheduleBurden:58,geographicPortability:70,automationResilience:88,exitOptions:72,selfEmployment:30,serviceObligation:0},
    sourceIds:['bls-aircraft','gtcc-aviation','pti-aerospace']
  }),
  O({
    id:'industrial-machinery-mechanic', soc:'49-9041', name:'Industrial Machinery Mechanic', family:'advanced-manufacturing',
    clusterIds:['advanced-manufacturing'], typicalEntry:'High school plus employer training, apprenticeship, or technical AAS depending on employer',
    localEvidence:{metro:'Greensboro-High Point', medianWage:59500, asOf:'2025-05', approximate:true},
    nationalEvidence:{growthPct:16, note:'BLS projects very strong growth as automated machinery becomes more complex.'},
    dimensions:{earlyIncome:68,matureIncome:58,entryReliability:86,marketDepth:86,localStrength:96,credentialMoat:76,educationCost:18,timeToIncome:18,earnWhileTraining:88,remotePotential:0,humanContact:28,physicalIntensity:74,acutePressure:48,scheduleBurden:66,geographicPortability:91,automationResilience:95,exitOptions:72,selfEmployment:30,serviceObligation:0},
    sourceIds:['bls-industrial-maint','gtcc-fame','toyota-nc']
  }),
  O({
    id:'mechatronics-technician', soc:'17-3024', name:'Electro-Mechanical / Mechatronics Technician', family:'advanced-manufacturing',
    clusterIds:['advanced-manufacturing','pti-aerospace'], typicalEntry:'Associate degree, technical diploma, apprenticeship, or equivalent industrial training',
    localEvidence:{metro:'Greensboro-High Point', medianWage:67940, asOf:'2025-05'},
    dimensions:{earlyIncome:71,matureIncome:62,entryReliability:82,marketDepth:66,localStrength:94,credentialMoat:78,educationCost:22,timeToIncome:26,earnWhileTraining:75,remotePotential:1,humanContact:25,physicalIntensity:62,acutePressure:45,scheduleBurden:57,geographicPortability:84,automationResilience:94,exitOptions:82,selfEmployment:25,serviceObligation:0},
    sourceIds:['gtcc-mechatronics','gtcc-fame','randolph-industrial','nc-oes-d4']
  }),
  O({
    id:'electrician', soc:'47-2111', name:'Electrician', family:'skilled-trades',
    clusterIds:['advanced-manufacturing','public-service'], typicalEntry:'Paid apprenticeship or technical training plus supervised experience; licensing varies by work performed',
    localEvidence:{metro:'Greensboro-High Point', medianWage:58380, asOf:'2025-05'},
    nationalEvidence:{medianWage:62350,growthPct:9,annualOpenings:81000},
    dimensions:{earlyIncome:63,matureIncome:69,entryReliability:91,marketDepth:97,localStrength:88,credentialMoat:88,educationCost:10,timeToIncome:8,earnWhileTraining:98,remotePotential:0,humanContact:38,physicalIntensity:78,acutePressure:42,scheduleBurden:45,geographicPortability:96,automationResilience:96,exitOptions:77,selfEmployment:94,serviceObligation:0},
    sourceIds:['bls-electrician','gap','nc-oes-d4']
  }),
  O({
    id:'hvac-technician', soc:'49-9021', name:'HVACR Mechanic / Installer', family:'skilled-trades',
    clusterIds:['public-service','advanced-manufacturing'], typicalEntry:'Technical school, apprenticeship, or employer training; EPA refrigerant certification commonly required',
    localEvidence:{metro:'Greensboro-High Point', medianWage:58520, asOf:'2025-05'},
    nationalEvidence:{growthPct:8,annualOpenings:40100},
    dimensions:{earlyIncome:61,matureIncome:65,entryReliability:91,marketDepth:94,localStrength:88,credentialMoat:83,educationCost:14,timeToIncome:14,earnWhileTraining:91,remotePotential:0,humanContact:54,physicalIntensity:82,acutePressure:35,scheduleBurden:72,geographicPortability:97,automationResilience:96,exitOptions:70,selfEmployment:91,serviceObligation:0},
    sourceIds:['bls-hvac','gap','nc-oes-d4']
  }),
  O({
    id:'electrical-engineer', soc:'17-2071', name:'Electrical Engineer', family:'engineering',
    clusterIds:['pti-aerospace','advanced-manufacturing','triangle-tech','charlotte-corporate'], typicalEntry:"Bachelor's degree in electrical engineering or closely related engineering discipline", credential:'ABET-accredited engineering education strongly preferred for many pathways',
    localEvidence:{metro:'Greensboro-High Point', medianWage:117480, asOf:'2025-05'},
    nationalEvidence:{growthPct:7,annualOpenings:17500,note:'Openings cited for electrical and electronics engineers together.'},
    dimensions:{earlyIncome:80,matureIncome:91,entryReliability:82,marketDepth:82,localStrength:86,credentialMoat:91,educationCost:52,timeToIncome:58,earnWhileTraining:15,remotePotential:38,humanContact:26,physicalIntensity:22,acutePressure:36,scheduleBurden:28,geographicPortability:91,automationResilience:92,exitOptions:96,selfEmployment:35,serviceObligation:0},
    sourceIds:['bls-ee','bls-gso-2025','ncat-majors']
  }),
  O({
    id:'industrial-engineer', soc:'17-2112', name:'Industrial Engineer', family:'engineering',
    clusterIds:['advanced-manufacturing','pti-aerospace','logistics-corridor','charlotte-corporate'], typicalEntry:"Bachelor's degree in industrial, systems, manufacturing, or closely related engineering", 
    localEvidence:{metro:'Greensboro-High Point', medianWage:95930, asOf:'2025-05'},
    nationalEvidence:{employment:351100,medianWage:101140,growthPct:11,annualOpenings:25200},
    dimensions:{earlyIncome:77,matureIncome:86,entryReliability:85,marketDepth:91,localStrength:95,credentialMoat:86,educationCost:50,timeToIncome:58,earnWhileTraining:14,remotePotential:28,humanContact:44,physicalIntensity:18,acutePressure:30,scheduleBurden:29,geographicPortability:94,automationResilience:95,exitOptions:97,selfEmployment:29,serviceObligation:0},
    sourceIds:['bls-ie','bls-gso-2025','ncat-majors','toyota-nc']
  }),
  O({
    id:'software-developer', soc:'15-1252', name:'Software Developer', family:'computing-data',
    clusterIds:['triangle-tech','charlotte-corporate'], typicalEntry:"Bachelor's degree common; strong portfolios/internships materially affect entry", 
    localEvidence:{metro:'Greensboro-High Point', medianWage:125190, asOf:'2025-05'},
    nationalEvidence:{annualOpenings:115200},
    dimensions:{earlyIncome:75,matureIncome:96,entryReliability:58,marketDepth:96,localStrength:56,credentialMoat:48,educationCost:48,timeToIncome:55,earnWhileTraining:18,remotePotential:94,humanContact:20,physicalIntensity:2,acutePressure:32,scheduleBurden:28,geographicPortability:99,automationResilience:62,exitOptions:98,selfEmployment:69,serviceObligation:0},
    sourceIds:['bls-software','bls-gso-2025','charlotte-programs']
  }),
  O({
    id:'information-security-analyst', soc:'15-1212', name:'Information Security Analyst', family:'computing-data',
    clusterIds:['triangle-tech','charlotte-corporate','triad-healthcare'], typicalEntry:"Bachelor's degree plus related IT experience is common", 
    localEvidence:{metro:'Greensboro-High Point', medianWage:103960, asOf:'2025-05'},
    nationalEvidence:{growthPct:29},
    dimensions:{earlyIncome:64,matureIncome:93,entryReliability:45,marketDepth:78,localStrength:55,credentialMoat:55,educationCost:48,timeToIncome:62,earnWhileTraining:15,remotePotential:88,humanContact:31,physicalIntensity:1,acutePressure:72,scheduleBurden:58,geographicPortability:97,automationResilience:85,exitOptions:95,selfEmployment:55,serviceObligation:0},
    sourceIds:['bls-infosec','bls-gso-2025']
  }),
  O({
    id:'computer-systems-analyst', soc:'15-1211', name:'Computer Systems Analyst', family:'computing-data',
    clusterIds:['triangle-tech','charlotte-corporate','triad-healthcare','advanced-manufacturing'], typicalEntry:"Bachelor's degree common; information systems, computer science, business, and domain backgrounds vary", 
    localEvidence:{metro:'Greensboro-High Point', medianWage:104050, asOf:'2025-05'},
    nationalEvidence:{annualOpenings:34200},
    dimensions:{earlyIncome:68,matureIncome:85,entryReliability:62,marketDepth:86,localStrength:67,credentialMoat:47,educationCost:47,timeToIncome:54,earnWhileTraining:14,remotePotential:82,humanContact:47,physicalIntensity:2,acutePressure:38,scheduleBurden:31,geographicPortability:96,automationResilience:78,exitOptions:98,selfEmployment:48,serviceObligation:0},
    sourceIds:['bls-systems','bls-gso-2025','uncg-isscm']
  }),
  O({
    id:'data-scientist', soc:'15-2051', name:'Data Scientist', family:'computing-data',
    clusterIds:['triangle-tech','charlotte-corporate','life-sciences'], typicalEntry:"Bachelor's degree commonly expected; advanced quantitative education may be preferred for some roles", 
    localEvidence:{metro:'Greensboro-High Point', medianWage:106060, asOf:'2025-05'},
    dimensions:{earlyIncome:72,matureIncome:92,entryReliability:48,marketDepth:67,localStrength:49,credentialMoat:55,educationCost:50,timeToIncome:58,earnWhileTraining:10,remotePotential:90,humanContact:24,physicalIntensity:1,acutePressure:25,scheduleBurden:22,geographicPortability:94,automationResilience:67,exitOptions:94,selfEmployment:50,serviceObligation:0},
    sourceIds:['bls-gso-2025','charlotte-programs']
  }),
  O({
    id:'accountant-auditor', soc:'13-2011', name:'Accountant / Auditor', family:'business-finance-logistics',
    clusterIds:['charlotte-corporate','triangle-tech','logistics-corridor'], typicalEntry:"Bachelor's degree typical; CPA provides a strong professional credential ladder", 
    localEvidence:{metro:'Greensboro-High Point', medianWage:77650, asOf:'2025-05'},
    nationalEvidence:{employment:1580000,annualOpenings:124200},
    dimensions:{earlyIncome:66,matureIncome:83,entryReliability:86,marketDepth:99,localStrength:83,credentialMoat:80,educationCost:44,timeToIncome:54,earnWhileTraining:16,remotePotential:78,humanContact:40,physicalIntensity:1,acutePressure:24,scheduleBurden:52,geographicPortability:99,automationResilience:74,exitOptions:94,selfEmployment:82,serviceObligation:0},
    sourceIds:['bls-accounting','uncg-accounting','bls-gso-2025']
  }),
  O({
    id:'logistician', soc:'13-1081', name:'Logistician / Supply Chain Analyst', family:'business-finance-logistics',
    clusterIds:['logistics-corridor','advanced-manufacturing','charlotte-corporate','pti-aerospace'], typicalEntry:"Bachelor's degree common; associate, military, or operations experience can support some entry routes", 
    localEvidence:{metro:'Greensboro-High Point', medianWage:74290, asOf:'2025-05'},
    nationalEvidence:{growthPct:17,annualOpenings:26400},
    dimensions:{earlyIncome:67,matureIncome:79,entryReliability:73,marketDepth:90,localStrength:98,credentialMoat:45,educationCost:42,timeToIncome:49,earnWhileTraining:28,remotePotential:48,humanContact:51,physicalIntensity:10,acutePressure:38,scheduleBurden:41,geographicPortability:96,automationResilience:80,exitOptions:93,selfEmployment:31,serviceObligation:0},
    sourceIds:['bls-logistics','bls-gso-2025']
  }),
  O({
    id:'clinical-lab-technologist', soc:'29-2010', name:'Clinical Laboratory Technologist / Technician', family:'healthcare-technical',
    clusterIds:['triad-healthcare','life-sciences'], typicalEntry:"Associate or bachelor's degree depending on technologist/technician role; certification commonly preferred or required by employer", 
    nationalEvidence:{growthPct:2,annualOpenings:22600},
    dimensions:{earlyIncome:64,matureIncome:63,entryReliability:88,marketDepth:87,localStrength:94,credentialMoat:86,educationCost:34,timeToIncome:37,earnWhileTraining:6,remotePotential:0,humanContact:18,physicalIntensity:25,acutePressure:28,scheduleBurden:58,geographicPortability:94,automationResilience:82,exitOptions:68,selfEmployment:12,serviceObligation:0},
    sourceIds:['bls-lab','bls-ws-2025']
  }),
  O({
    id:'health-information-technologist', soc:'29-9021', name:'Health Information Technologist / Medical Registrar', family:'healthcare-technical',
    clusterIds:['triad-healthcare','life-sciences'], typicalEntry:"Associate or bachelor's degree depending on role; health-information credentials can strengthen entry", 
    nationalEvidence:{growthPct:15,annualOpenings:3200},
    dimensions:{earlyIncome:60,matureIncome:69,entryReliability:74,marketDepth:47,localStrength:84,credentialMoat:67,educationCost:34,timeToIncome:39,earnWhileTraining:8,remotePotential:72,humanContact:16,physicalIntensity:2,acutePressure:16,scheduleBurden:20,geographicPortability:88,automationResilience:74,exitOptions:88,selfEmployment:22,serviceObligation:0},
    sourceIds:['bls-hit','forsyth-catalog']
  }),
  O({
    id:'medical-equipment-repairer', soc:'49-9062', name:'Medical Equipment Repairer / BMET', family:'healthcare-technical',
    clusterIds:['triad-healthcare','life-sciences'], typicalEntry:'Associate degree or technical training in biomedical equipment/electronics; employer-specific certification may follow',
    nationalEvidence:{growthPct:13,annualOpenings:7300},
    dimensions:{earlyIncome:62,matureIncome:59,entryReliability:84,marketDepth:64,localStrength:87,credentialMoat:77,educationCost:25,timeToIncome:29,earnWhileTraining:24,remotePotential:2,humanContact:17,physicalIntensity:47,acutePressure:34,scheduleBurden:48,geographicPortability:88,automationResilience:94,exitOptions:83,selfEmployment:25,serviceObligation:0},
    sourceIds:['bls-med-equipment','bls-ws-2025']
  }),
  O({
    id:'registered-nurse', soc:'29-1141', name:'Registered Nurse', family:'healthcare-clinical',
    clusterIds:['triad-healthcare'], typicalEntry:'ADN or BSN plus NCLEX-RN licensure', credential:'RN license',
    dimensions:{earlyIncome:78,matureIncome:81,entryReliability:96,marketDepth:99,localStrength:99,credentialMoat:97,educationCost:34,timeToIncome:35,earnWhileTraining:7,remotePotential:12,humanContact:99,physicalIntensity:76,acutePressure:82,scheduleBurden:78,geographicPortability:99,automationResilience:96,exitOptions:97,selfEmployment:26,serviceObligation:0},
    sourceIds:['bls-rn','bls-ws-2025']
  }),
  O({
    id:'public-safety-telecommunicator', soc:'43-5031', name:'Public Safety Telecommunicator / 911 Dispatcher', family:'public-service',
    clusterIds:['public-service'], typicalEntry:'High school diploma plus employer training and required certifications',
    dimensions:{earlyIncome:57,matureIncome:51,entryReliability:83,marketDepth:71,localStrength:84,credentialMoat:55,educationCost:3,timeToIncome:4,earnWhileTraining:92,remotePotential:0,humanContact:82,physicalIntensity:2,acutePressure:94,scheduleBurden:91,geographicPortability:92,automationResilience:88,exitOptions:49,selfEmployment:0,serviceObligation:0},
    sourceIds:['bls-911','nc-proj-2024-34']
  }),
  O({
    id:'police-patrol-officer', soc:'33-3051', name:'Police / Sheriff Patrol Officer', family:'public-service',
    clusterIds:['public-service'], typicalEntry:'High school or college depending on agency plus academy/BLET and agency hiring standards',
    localEvidence:{metro:'Greensboro-High Point', medianWage:60830, asOf:'2025-05'},
    nationalEvidence:{annualOpenings:62200,note:'Police and detectives occupational family.'},
    dimensions:{earlyIncome:62,matureIncome:63,entryReliability:80,marketDepth:91,localStrength:86,credentialMoat:83,educationCost:12,timeToIncome:16,earnWhileTraining:72,remotePotential:0,humanContact:92,physicalIntensity:72,acutePressure:94,scheduleBurden:84,geographicPortability:90,automationResilience:96,exitOptions:62,selfEmployment:5,serviceObligation:0},
    sourceIds:['bls-police','bls-gso-2025']
  }),
  O({
    id:'heavy-truck-driver', soc:'53-3032', name:'Heavy / Tractor-Trailer Truck Driver', family:'transportation-logistics',
    clusterIds:['logistics-corridor'], typicalEntry:'Commercial driver training and CDL', credential:'Commercial Driver License',
    localEvidence:{metro:'Greensboro-High Point', medianWage:58480, asOf:'2025-05'},
    dimensions:{earlyIncome:66,matureIncome:56,entryReliability:91,marketDepth:99,localStrength:99,credentialMoat:80,educationCost:10,timeToIncome:10,earnWhileTraining:42,remotePotential:0,humanContact:23,physicalIntensity:45,acutePressure:42,scheduleBurden:84,geographicPortability:98,automationResilience:68,exitOptions:60,selfEmployment:79,serviceObligation:0},
    sourceIds:['bls-truck','bls-gso-2025']
  }),
  O({
    id:'machinist', soc:'51-4041', name:'Machinist / CNC Machinist', family:'advanced-manufacturing',
    clusterIds:['advanced-manufacturing','pti-aerospace'], typicalEntry:'High school plus employer training, certificate/AAS, or apprenticeship; CNC/CAD/CAM skills improve mobility',
    dimensions:{earlyIncome:59,matureIncome:55,entryReliability:84,marketDepth:84,localStrength:92,credentialMoat:72,educationCost:16,timeToIncome:18,earnWhileTraining:72,remotePotential:0,humanContact:19,physicalIntensity:54,acutePressure:30,scheduleBurden:54,geographicPortability:85,automationResilience:73,exitOptions:71,selfEmployment:40,serviceObligation:0},
    sourceIds:['nc-proj-2024-34','pti-aerospace']
  })
]);

export const OCCUPATION_BY_ID = Object.freeze(Object.fromEntries(OCCUPATIONS.map(item => [item.id, item])));
