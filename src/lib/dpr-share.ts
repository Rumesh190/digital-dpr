import type {GeneratedDPRPdf} from "@/lib/dpr-pdf";
import type {DPR,Project} from "@/types";
import {formatDPRDate} from "@/lib/dpr";
import {user} from "@/data/mock-data";

export function downloadDPRPdf(pdf:GeneratedDPRPdf){const url=URL.createObjectURL(pdf.blob);try{const anchor=document.createElement("a");anchor.href=url;anchor.download=pdf.filename;anchor.style.display="none";document.body.appendChild(anchor);anchor.click();anchor.remove()}finally{window.setTimeout(()=>URL.revokeObjectURL(url),1000)}}
export function fileShareAvailable(){return typeof navigator!=="undefined"&&typeof navigator.share==="function"}
export async function shareDPRPdf(pdf:GeneratedDPRPdf,dpr:DPR,project:Project){if(!fileShareAvailable())return"unsupported" as const;const payload={files:[pdf.file],title:`Daily Progress Report — ${project.name}`,text:`Daily Progress Report\n${project.name}\n${formatDPRDate(dpr.date,{day:"numeric",month:"short",year:"numeric"})}\n\nPrepared by ${user.name}`};if(typeof navigator.canShare==="function"&&!navigator.canShare({files:payload.files}))return"unsupported" as const;try{await navigator.share(payload);return"shared" as const}catch(error){if(error instanceof DOMException&&error.name==="AbortError")return"cancelled" as const;throw error}}
