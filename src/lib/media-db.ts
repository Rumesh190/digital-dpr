const DB_NAME="digital-dpr-media";
const DB_VERSION=2;
export const PHOTO_STORE="site-photos";
export const VOICE_STORE="voice-notes";

function openMediaDatabase(){return new Promise<IDBDatabase>((resolve,reject)=>{if(typeof indexedDB==="undefined"){reject(new Error("IndexedDB unavailable"));return}const request=indexedDB.open(DB_NAME,DB_VERSION);request.onupgradeneeded=()=>{for(const store of[PHOTO_STORE,VOICE_STORE])if(!request.result.objectStoreNames.contains(store))request.result.createObjectStore(store)};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error??new Error("Could not open media storage"));request.onblocked=()=>reject(new Error("Media storage upgrade was blocked"))})}

export async function mediaTransaction<T>(storeName:string,mode:IDBTransactionMode,operation:(store:IDBObjectStore)=>IDBRequest<T>){const database=await openMediaDatabase();return new Promise<T>((resolve,reject)=>{const transaction=database.transaction(storeName,mode);const request=operation(transaction.objectStore(storeName));let result:T;request.onsuccess=()=>{result=request.result};request.onerror=()=>reject(request.error??new Error("Media storage failed"));transaction.oncomplete=()=>{database.close();resolve(result)};transaction.onabort=()=>{database.close();reject(transaction.error??new Error("Media storage transaction aborted"))};transaction.onerror=()=>{database.close()}})}
