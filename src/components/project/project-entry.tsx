"use client";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {resolvePreferredProject} from "@/lib/projects";

export function ProjectEntry({route,params}:{route:string;params?:Record<string,string|undefined>}){
 const router=useRouter();
 useEffect(()=>{const timer=window.setTimeout(()=>{const project=resolvePreferredProject();const query=new URLSearchParams({project:project.id});Object.entries(params??{}).forEach(([key,value])=>{if(value)query.set(key,value)});router.replace(`${route}?${query}`)},0);return()=>window.clearTimeout(timer)},[params,route,router]);
 return <main className="grid min-h-[60dvh] place-items-center text-[14px] text-[#71717a]">Opening project…</main>
}
