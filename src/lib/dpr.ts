import type {DPR,DPRStatus,TomorrowActivity} from "@/types";

export const DPR_RECORDS_KEY="digital-dpr:records:v2";
export const DPR_CHANGE_EVENT="digital-dpr:change";
export const requiredSections=["work","manpower","materials","photos","tomorrowPlan"] as const;
export type RequiredSection=typeof requiredSections[number];
export type DPRRecords=Record<string,DPR>;

export const toISODate=(date:Date)=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
export const todayISO=()=>toISODate(new Date());
export const parseISODate=(value:string)=>{const[y,m,d]=value.split("-").map(Number);return new Date(y,m-1,d)};
export const addDays=(value:string,days:number)=>{const date=parseISODate(value);date.setDate(date.getDate()+days);return toISODate(date)};
export const formatDPRDate=(value:string,options:Intl.DateTimeFormatOptions={day:"numeric",month:"long",year:"numeric"})=>new Intl.DateTimeFormat("en-GB",options).format(parseISODate(value));
export const recordKey=(projectId:string,date:string)=>`${projectId}:${date}`;

export const sectionComplete=(dpr:DPR,key:RequiredSection)=>{
 if(key==="work")return dpr.work.length>0&&dpr.work.every(row=>!!row.activity&&row.planned>0&&typeof row.achieved==="number"&&row.achieved>=0);
 if(key==="manpower")return dpr.manpower.length>0&&dpr.manpower.every(row=>!!row.role&&row.inHouse+row.subcontractor>0);
 if(key==="materials")return dpr.materials.length>0&&dpr.materials.every(row=>!!row.material&&row.quantity>0);
 if(key==="photos")return dpr.photos.length>0&&dpr.photos.every(row=>!!row.src);
 return dpr.tomorrowPlan.length>0&&dpr.tomorrowPlan.every(row=>!!row.activity&&row.planned>0);
};
export const completedRequired=(dpr:DPR)=>requiredSections.filter(key=>sectionComplete(dpr,key)).length;
export const completionPercent=(dpr:DPR)=>Math.round(completedRequired(dpr)/requiredSections.length*100);
export const missingSections=(dpr:DPR)=>requiredSections.filter(key=>!sectionComplete(dpr,key));
export const carryForwardPlan=(plan:TomorrowActivity[]):DPR["work"]=>plan.map(item=>({id:`work-${crypto.randomUUID()}`,activity:item.activity,unit:item.unit,planned:item.planned,achieved:null,remarks:item.remarks}));

const submittedSeed:DPR={id:"dpr-commercial-tower-2026-09-28",projectId:"commercial-tower",date:"2026-09-28",status:"submitted",work:[{id:"work-seed",activity:"Cable Tray Installation",unit:"m",planned:100,achieved:75}],manpower:[{id:"mp-seed",role:"Electrician",inHouse:8,subcontractor:12}],materials:[{id:"mat-seed",material:"Cable Tray",unit:"m",quantity:75}],photos:[{id:"photo-seed",src:"/window.svg",name:"Site progress record"}],siteVisits:[],tomorrowPlan:[{id:"plan-seed-1",activity:"Cable Pulling",unit:"m",planned:60},{id:"plan-seed-2",activity:"Panel Installation",unit:"nos",planned:2}],generalRemarks:"",updatedAt:"2026-09-28T18:00:00.000Z"};
const seedRecords: DPRRecords={[recordKey(submittedSeed.projectId,submittedSeed.date)]:submittedSeed};

export function loadDPRRecords():DPRRecords{if(typeof window==="undefined")return seedRecords;const stored=localStorage.getItem(DPR_RECORDS_KEY);if(!stored){localStorage.setItem(DPR_RECORDS_KEY,JSON.stringify(seedRecords));return seedRecords}try{return JSON.parse(stored) as DPRRecords}catch{return seedRecords}}
export function replaceDPRRecords(records:DPRRecords){localStorage.setItem(DPR_RECORDS_KEY,JSON.stringify(records));window.dispatchEvent(new CustomEvent(DPR_CHANGE_EVENT))}
export const getDPR=(projectId:string,date:string)=>loadDPRRecords()[recordKey(projectId,date)]??null;
export function saveDPR(dpr:DPR){if(dpr.status==="submitted"&&missingSections(dpr).length)throw new Error("A submitted DPR must contain all required sections.");const records=loadDPRRecords();records[recordKey(dpr.projectId,dpr.date)]={...dpr,updatedAt:new Date().toISOString()};localStorage.setItem(DPR_RECORDS_KEY,JSON.stringify(records));window.dispatchEvent(new CustomEvent(DPR_CHANGE_EVENT));return records[recordKey(dpr.projectId,dpr.date)]}
export function createDPR(projectId:string,date:string,plannedWork:TomorrowActivity[]=[]){const existing=getDPR(projectId,date);if(existing)return existing;const draft:DPR={id:`dpr-${projectId}-${date}`,projectId,date,status:"draft",work:carryForwardPlan(plannedWork),manpower:[],materials:[],photos:[],siteVisits:[],tomorrowPlan:[],generalRemarks:"",updatedAt:new Date().toISOString()};return saveDPR(draft)}
export function setDPRStatus(dpr:DPR,status:DPRStatus){return saveDPR({...dpr,status})}
export function deleteDPR(projectId:string,date:string){const records=loadDPRRecords();const key=recordKey(projectId,date);if(!(key in records))return false;delete records[key];localStorage.setItem(DPR_RECORDS_KEY,JSON.stringify(records));window.dispatchEvent(new CustomEvent(DPR_CHANGE_EVENT));return true}
