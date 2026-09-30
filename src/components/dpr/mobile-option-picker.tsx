"use client";

import {Check,ChevronDown} from "lucide-react";
import {useEffect,useId,useRef,useState} from "react";

export function MobileOptionPicker({label,value,options,onChange,icon,error}:{label:string;value:string;options:string[];onChange:(value:string)=>void;icon?:React.ReactNode;error?:string}){
 const[open,setOpen]=useState(false);const id=useId();const rootRef=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(!open)return;const close=(event:PointerEvent)=>{if(!rootRef.current?.contains(event.target as Node))setOpen(false)};const escape=(event:KeyboardEvent)=>{if(event.key==="Escape")setOpen(false)};document.addEventListener("pointerdown",close);document.addEventListener("keydown",escape);return()=>{document.removeEventListener("pointerdown",close);document.removeEventListener("keydown",escape)}},[open]);
 const choose=(option:string)=>{onChange(option);setOpen(false)};
 return <div ref={rootRef} className="relative min-w-0">
  <button type="button" aria-expanded={open} aria-controls={id} aria-haspopup="listbox" onClick={()=>setOpen(value=>!value)} className={`focus-ring flex min-h-14 w-full min-w-0 items-center rounded-[15px] border bg-white text-left transition-colors ${error?"border-[#dc4742]":"border-[#dfe2e8]"}`}>
   {icon&&<span className="ml-3 grid size-10 shrink-0 place-items-center rounded-[12px] bg-[#f4f6f8]">{icon}</span>}
   <span className="min-w-0 flex-1 truncate px-3 text-[15px] font-semibold">{value}</span><ChevronDown size={18} className={`mr-3 shrink-0 text-[#687080] transition-transform ${open?"rotate-180":""}`}/>
  </button>
  {open&&<div id={id} role="listbox" aria-label={label} className="mt-2 max-h-[min(300px,38dvh)] overflow-y-auto overscroll-contain rounded-[15px] border border-[#dfe2e8] bg-white p-1.5 shadow-[0_8px_20px_rgba(24,24,27,.09)]">
   {options.map(option=><button key={option} type="button" role="option" aria-selected={option===value} onClick={()=>choose(option)} className={`focus-ring flex min-h-11 w-full items-center justify-between rounded-[11px] px-3 text-left text-[14px] ${option===value?"bg-[#fff0ef] font-bold text-[#d94742]":"font-medium text-[#353943]"}`}><span>{option}</span>{option===value&&<Check size={17} strokeWidth={2.6}/>}</button>)}
  </div>}
 </div>
}
