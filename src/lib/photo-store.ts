import type {DPR} from "@/types";
import {loadDPRRecords} from "@/lib/dpr";
import {mediaTransaction,PHOTO_STORE} from "@/lib/media-db";

const PHOTO_PREFIX="idb-photo:";

export const isStoredPhoto=(src:string)=>src.startsWith(PHOTO_PREFIX);
export const savePhotoBlob=async(id:string,blob:Blob)=>{await mediaTransaction(PHOTO_STORE,"readwrite",store=>store.put(blob,id));return `${PHOTO_PREFIX}${id}`};
export const getPhotoBlob=(src:string)=>isStoredPhoto(src)?mediaTransaction<Blob|undefined>(PHOTO_STORE,"readonly",store=>store.get(src.slice(PHOTO_PREFIX.length))):Promise.resolve(undefined);
export const deleteStoredPhoto=(src:string)=>isStoredPhoto(src)?mediaTransaction(PHOTO_STORE,"readwrite",store=>store.delete(src.slice(PHOTO_PREFIX.length))):Promise.resolve(undefined);
export async function deleteStoredPhotoIfUnreferenced(src:string){if(!isStoredPhoto(src))return;const referenced=Object.values(loadDPRRecords()).some(dpr=>dpr.photos.some(photo=>photo.src===src));if(!referenced)await deleteStoredPhoto(src)}
export async function savePhotoDataUrl(id:string,dataUrl:string){const blob=await fetch(dataUrl).then(response=>response.blob());return savePhotoBlob(id,blob)}
export async function migrateEmbeddedPhotos(dpr:DPR){let changed=false;const photos=[];for(const photo of dpr.photos){if(photo.src.startsWith("data:image/")){const src=await savePhotoDataUrl(photo.id,photo.src);photos.push({...photo,src});changed=true}else photos.push(photo)}return changed?{...dpr,photos}:dpr}
export async function migrateEmbeddedPhotoRecords(records:Record<string,DPR>){let changed=false;const migrated:Record<string,DPR>={};for(const[key,dpr]of Object.entries(records)){const next=await migrateEmbeddedPhotos(dpr);migrated[key]=next;if(next!==dpr)changed=true}return{records:changed?migrated:records,changed}}
