import { CAREERS, DIMENSIONS } from './data.js';

export const clamp = (v,min=0,max=100) => Math.max(min,Math.min(max,v));

export function initialProfile() {
  return Object.fromEntries(Object.keys(DIMENSIONS).map(k => [k, 50]));
}

export function applyEffects(profile, effects={}) {
  const next = {...profile};
  for (const [key,delta] of Object.entries(effects)) {
    if (key in next) next[key] = clamp(next[key] + delta);
  }
  return next;
}

const DIM_WEIGHTS = {
  earlyEarnings:1.25,incomeCeiling:1.25,affordability:1.15,schoolTolerance:1.1,
  patientContact:1.05,handsOnTech:1.0,scienceTolerance:1.0,deskPreference:.9,
  schedulePredictability:1.0,highStakesTolerance:1.0,physicalTolerance:.75,
  jobStability:.95,geographicFlexibility:.8,careerLadder:.8
};

export function scoreCareer(profile, career) {
  let weightedDistance = 0;
  let weightTotal = 0;
  for (const key of Object.keys(DIMENSIONS)) {
    const w = DIM_WEIGHTS[key] ?? 1;
    weightedDistance += Math.abs(profile[key] - career.attrs[key]) * w;
    weightTotal += 100 * w;
  }
  const raw = 100 * (1 - weightedDistance / weightTotal);
  return Math.round(clamp(raw));
}

export function rankCareers(profile) {
  return CAREERS
    .map(c => ({...c, score:scoreCareer(profile,c)}))
    .sort((a,b) => b.score - a.score || a.name.localeCompare(b.name));
}

export function explainMatch(profile, career, count=3) {
  const rows = Object.keys(DIMENSIONS).map(key => ({
    key,
    label:DIMENSIONS[key],
    diff:Math.abs(profile[key]-career.attrs[key]),
    profile:profile[key],
    career:career.attrs[key],
    weight:DIM_WEIGHTS[key] ?? 1
  }));
  const strengths = [...rows].sort((a,b) => (a.diff*a.weight)-(b.diff*b.weight)).slice(0,count);
  const frictions = [...rows].sort((a,b) => (b.diff*b.weight)-(a.diff*a.weight)).slice(0,count);
  return {strengths,frictions};
}

export function profileSignal(profile) {
  const values = Object.values(profile);
  if (!values.length) return 0;
  const meanDistance = values.reduce((sum, value) => sum + Math.abs(value - 50), 0) / values.length;
  return Math.round(clamp((meanDistance / 50) * 100));
}

export function topProfileTraits(profile, count=5) {
  const centered = Object.entries(profile).map(([key,value]) => ({
    key,label:DIMENSIONS[key],value,intensity:Math.abs(value-50)
  }));
  return centered.sort((a,b) => b.intensity-a.intensity).slice(0,count);
}

function salaryForStandard(fin, yearAfterTraining) {
  if (yearAfterTraining < 0) return 0;
  const rampYears = 6;
  const t = Math.min(yearAfterTraining / rampYears, 1);
  const base = fin.startSalary + (fin.targetSalary-fin.startSalary)*t;
  const later = Math.max(yearAfterTraining-rampYears,0);
  return base * Math.pow(1+fin.growth,later);
}

function careerCashflow(career, age) {
  const y = age - 18;
  const f = career.finance;
  if (f.kind === 'crna') {
    if (y < 2) return {income:0, tuition:f.tuition*(12000/73000)/2};
    if (y < 4) return {income:68000 + (y-2)*7000, tuition:f.tuition*(6000/73000)/2};
    if (y < 7) return {income:0, tuition:f.tuition*(55000/73000)/3};
    return {income:salaryForStandard({...f,startSalary:220000,targetSalary:248320,growth:.028}, y-7), tuition:0};
  }
  if (f.kind === 'atc') {
    if (y < 2) return {income:0,tuition:f.tuition/2};
    if (y < 3) return {income:45000,tuition:0};
    return {income:salaryForStandard({...f,startSalary:65000,targetSalary:f.targetSalary},y-3),tuition:0};
  }
  if (y < f.trainingYears) return {income:0,tuition:f.tuition/f.trainingYears};
  return {income:salaryForStandard(f,y-f.trainingYears),tuition:0};
}

export function simulateCareer(career, options={}) {
  const {
    startAge=18,endAge=35,investRate=.15,annualReturn=.07,
    livingAtHomeUntil=22,loanShare=.5,loanApr=.065
  } = options;
  let investments=0, debt=0, cumulativeIncome=0, cumulativeTuition=0;
  const rows=[];
  for (let age=startAge; age<=endAge; age++) {
    const {income,tuition} = careerCashflow(career,age);
    cumulativeIncome += income;
    cumulativeTuition += tuition;
    investments *= (1+annualReturn);
    debt *= (1+loanApr);
    const loanTuition = tuition * loanShare;
    debt += loanTuition;
    const cashTuition = tuition - loanTuition;
    const homeBonus = age < livingAtHomeUntil ? .04 : 0;
    const savingsRate = Math.max(0, investRate + homeBonus);
    if (income > 0) {
      const available = Math.max(0, income*.73 - cashTuition);
      const debtPay = Math.min(debt, available*.18);
      debt -= debtPay;
      investments += Math.max(0, available*savingsRate);
    }
    rows.push({age,income,debt,investments,netWorth:investments-debt,cumulativeIncome,cumulativeTuition});
  }
  return rows;
}
