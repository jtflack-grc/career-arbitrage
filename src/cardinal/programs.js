import { occupationRef } from './schema.js';

export const PROGRAMS = Object.freeze([
  {
    id:'gtcc-aviation-systems-aas', institution:'GTCC', name:'Aviation Systems Technology', credential:'AAS / diploma / certificates', routeType:'community-college',
    cip:'47.0607', durationMonths:24, costModel:{type:'published-program-estimate', amount:9850, excludes:['FAA testing']},
    onRampClarity:5, admissionGate:'Program admission / FAA-approved curriculum',
    occupationRefs:[occupationRef('aircraft-mechanic','direct','FAA A&P pathway'),occupationRef('avionics-technician','strong','Avionics specialization available within GTCC aviation offerings')],
    clusterIds:['pti-aerospace'], sourceIds:['gtcc-aviation','nces-cip-soc']
  },
  {
    id:'gtcc-mechatronics-aas', institution:'GTCC', name:'Mechatronics Engineering Technology', credential:'AAS', routeType:'community-college',
    cip:'15.0403', durationMonths:24, onRampClarity:4, admissionGate:'Open college admission; course prerequisites apply',
    occupationRefs:[occupationRef('mechatronics-technician','direct'),occupationRef('industrial-machinery-mechanic','strong')],
    clusterIds:['advanced-manufacturing','pti-aerospace'], sourceIds:['gtcc-mechatronics','nces-cip-soc']
  },
  {
    id:'gtcc-fame-mechatronics', institution:'GTCC / NC FAME', name:'FAME Advanced Manufacturing Technician pathway', credential:'Mechatronics AAS + sponsored paid work experience', routeType:'apprenticeship',
    cip:'15.0403', durationMonths:24, onRampClarity:5, admissionGate:'Application plus employer sponsorship/selection', earnWhileLearning:true,
    occupationRefs:[occupationRef('mechatronics-technician','direct'),occupationRef('industrial-machinery-mechanic','direct')],
    clusterIds:['advanced-manufacturing'], sourceIds:['gtcc-fame','toyota-nc']
  },
  {
    id:'gap-electrical', institution:'Guilford Apprenticeship Partners / employer + GTCC', name:'Electrical Apprenticeship', credential:'Paid apprenticeship + related GTCC credential/AAS', routeType:'apprenticeship',
    durationMonths:48, onRampClarity:5, admissionGate:'Youth apprenticeship application and employer selection', earnWhileLearning:true,
    occupationRefs:[occupationRef('electrician','direct')], clusterIds:['advanced-manufacturing','public-service'], sourceIds:['gap']
  },
  {
    id:'gap-mechatronics', institution:'Guilford Apprenticeship Partners / employer + GTCC', name:'Mechatronics / Advanced Manufacturing Apprenticeship', credential:'Paid apprenticeship + related GTCC credential/AAS', routeType:'apprenticeship',
    durationMonths:48, onRampClarity:5, admissionGate:'Youth apprenticeship application and employer selection', earnWhileLearning:true,
    occupationRefs:[occupationRef('mechatronics-technician','direct'),occupationRef('industrial-machinery-mechanic','direct')], clusterIds:['advanced-manufacturing'], sourceIds:['gap']
  },
  {
    id:'gtcc-aa-transfer', institution:'GTCC', name:'Associate in Arts - Transfer', credential:'AA', routeType:'community-college',
    durationMonths:24, onRampClarity:1, admissionGate:'Open college admission; transfer articulation rules apply',
    occupationRefs:[], clusterIds:[], sourceIds:['nces-cip-soc'],
    note:'Deliberately low on-ramp clarity because the AA is designed as a transfer credential, not a direct occupation credential.'
  },
  {
    id:'forsyth-mlt-aas', institution:'Forsyth Tech', name:'Medical Laboratory Technology', credential:'AAS', routeType:'community-college',
    cip:'51.1004', durationMonths:24, onRampClarity:5, admissionGate:'Health-program admission requirements / limited enrollment',
    occupationRefs:[occupationRef('clinical-lab-technologist','direct')], clusterIds:['triad-healthcare','life-sciences'], sourceIds:['forsyth-catalog','nces-cip-soc']
  },
  {
    id:'forsyth-health-it-aas', institution:'Forsyth Tech', name:'Health Information Technology', credential:'AAS', routeType:'community-college',
    cip:'51.0707', durationMonths:24, onRampClarity:4, admissionGate:'Program admission requirements',
    occupationRefs:[occupationRef('health-information-technologist','direct'),occupationRef('computer-systems-analyst','adjacent','Possible later systems/informatics destination with experience')],
    clusterIds:['triad-healthcare','life-sciences'], sourceIds:['forsyth-catalog','nces-cip-soc']
  },
  {
    id:'randolph-industrial-systems-aas', institution:'Randolph Community College', name:'Industrial Systems Technology', credential:'AAS', routeType:'community-college',
    cip:'47.0303', durationMonths:24, onRampClarity:4, admissionGate:'College/program admission',
    occupationRefs:[occupationRef('industrial-machinery-mechanic','direct'),occupationRef('mechatronics-technician','strong')],
    clusterIds:['advanced-manufacturing'], sourceIds:['randolph-industrial','nces-cip-soc']
  },
  {
    id:'ncat-electrical-engineering-bs', institution:'NC A&T', name:'Electrical Engineering', credential:'BS', routeType:'four-year-college',
    cip:'14.1001', durationMonths:48, onRampClarity:4, admissionGate:'University + engineering progression requirements',
    occupationRefs:[occupationRef('electrical-engineer','direct')], clusterIds:['pti-aerospace','advanced-manufacturing','triangle-tech','charlotte-corporate'], sourceIds:['ncat-majors','nces-cip-soc']
  },
  {
    id:'ncat-industrial-systems-engineering-bs', institution:'NC A&T', name:'Industrial & Systems Engineering', credential:'BS', routeType:'four-year-college',
    cip:'14.3501', durationMonths:48, onRampClarity:4, admissionGate:'University + engineering progression requirements',
    occupationRefs:[occupationRef('industrial-engineer','direct'),occupationRef('logistician','adjacent','Supply-chain/operations roles are common adjacent destinations')],
    clusterIds:['advanced-manufacturing','pti-aerospace','logistics-corridor'], sourceIds:['ncat-majors','nces-cip-soc']
  },
  {
    id:'uncg-isscm-bs', institution:'UNCG', name:'Information Systems & Supply Chain Management', credential:'BS', routeType:'four-year-college',
    cip:'52.1201', durationMonths:48, onRampClarity:3, admissionGate:'University + Bryan School requirements',
    occupationRefs:[occupationRef('computer-systems-analyst','strong'),occupationRef('logistician','strong'),occupationRef('information-security-analyst','adjacent','Cyber concentration can support later security entry; related experience remains important')],
    clusterIds:['logistics-corridor','triangle-tech','charlotte-corporate','triad-healthcare'], sourceIds:['uncg-isscm','nces-cip-soc']
  },
  {
    id:'uncg-accounting-bs', institution:'UNCG', name:'Accounting', credential:'BS', routeType:'four-year-college',
    cip:'52.0301', durationMonths:48, onRampClarity:4, admissionGate:'University + Bryan School requirements',
    occupationRefs:[occupationRef('accountant-auditor','direct')], clusterIds:['charlotte-corporate','triangle-tech','logistics-corridor'], sourceIds:['uncg-accounting','nces-cip-soc']
  },
  {
    id:'charlotte-computer-science-bs', institution:'UNC Charlotte', name:'Computer Science', credential:'BS', routeType:'four-year-college',
    cip:'11.0701', durationMonths:48, onRampClarity:3, admissionGate:'University admission plus competitive-major requirements',
    occupationRefs:[occupationRef('software-developer','strong'),occupationRef('data-scientist','adjacent'),occupationRef('information-security-analyst','adjacent')],
    clusterIds:['charlotte-corporate','triangle-tech'], sourceIds:['charlotte-programs','nces-cip-soc']
  },
  {
    id:'charlotte-data-science-bs', institution:'UNC Charlotte', name:'Data Science', credential:'BS', routeType:'four-year-college',
    durationMonths:48, onRampClarity:3, admissionGate:'University / program requirements',
    occupationRefs:[occupationRef('data-scientist','strong'),occupationRef('computer-systems-analyst','adjacent')],
    clusterIds:['charlotte-corporate','triangle-tech','life-sciences'], sourceIds:['charlotte-programs']
  }
]);

export const PROGRAM_BY_ID = Object.freeze(Object.fromEntries(PROGRAMS.map(item => [item.id, item])));
