import {loadDPRRecords} from "@/lib/dpr";
import {mediaTransaction,VOICE_STORE} from "@/lib/media-db";

export const saveVoiceNote=(id:string,blob:Blob)=>mediaTransaction(VOICE_STORE,"readwrite",store=>store.put(blob,id));
export const getVoiceNote=(id:string)=>mediaTransaction<Blob|undefined>(VOICE_STORE,"readonly",store=>store.get(id));
export const deleteVoiceNote=(id:string)=>mediaTransaction(VOICE_STORE,"readwrite",store=>store.delete(id));
export async function deleteVoiceNoteIfUnreferenced(id:string){const referenced=Object.values(loadDPRRecords()).some(dpr=>dpr.siteVisits.some(visit=>visit.audioId===id));if(!referenced)await deleteVoiceNote(id)}
