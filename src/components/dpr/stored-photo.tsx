/* eslint-disable @next/next/no-img-element */
"use client";

import {ImageOff} from "lucide-react";
import {useEffect,useState} from "react";
import {getPhotoBlob,isStoredPhoto} from "@/lib/photo-store";

export function StoredPhoto({src,alt,className}:{src:string;alt:string;className?:string}){const[result,setResult]=useState<{source:string;url:string;missing:boolean}>({source:"",url:"",missing:false});const stored=isStoredPhoto(src);useEffect(()=>{let active=true;let objectUrl="";if(!isStoredPhoto(src))return;getPhotoBlob(src).then(blob=>{if(!active)return;if(blob){objectUrl=URL.createObjectURL(blob);setResult({source:src,url:objectUrl,missing:false})}else setResult({source:src,url:"",missing:true})}).catch(()=>{if(active)setResult({source:src,url:"",missing:true})});return()=>{active=false;if(objectUrl)URL.revokeObjectURL(objectUrl)}},[src]);const current=result.source===src?result:null;const resolved=stored?current?.url:src;if(resolved)return <img src={resolved} alt={alt} className={className}/>;if(current?.missing)return <span role="img" aria-label={`${alt} unavailable`} className={`${className??""} flex flex-col items-center justify-center gap-2 bg-[#e9ebef] p-3 text-center text-[11px] font-semibold text-[#747b89]`}><ImageOff size={20}/><span>Photo unavailable</span></span>;return <span role="img" aria-label={`${alt} loading`} className={`${className??""} block animate-pulse bg-[#e5e7eb]`}/>}
