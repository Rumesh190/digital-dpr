import type {DPR,Project} from "@/types";

export function buildDPRReportData(dpr:DPR,project:Project){
 const manpower=dpr.manpower.reduce((totals,row)=>({inHouse:totals.inHouse+row.inHouse,subcontractor:totals.subcontractor+row.subcontractor,total:totals.total+row.inHouse+row.subcontractor}),{inHouse:0,subcontractor:0,total:0});
 return{dpr,project,manpower,summary:[
  {label:"Work activities",value:dpr.work.length},
  {label:"Total manpower",value:manpower.total},
  {label:"Materials used",value:dpr.materials.length},
  {label:"Site photos",value:dpr.photos.length},
  ...(dpr.siteVisits.length?[{label:"Site visits",value:dpr.siteVisits.length}]:[]),
  ...(dpr.tomorrowPlan.length?[{label:"Tomorrow activities",value:dpr.tomorrowPlan.length}]:[]),
 ]};
}

export function workProgress(planned:number,achieved:number|null){return planned>0&&achieved!==null?Math.max(0,Math.round(achieved/planned*100)):null}
