import {DPREditor} from "@/components/dpr/dpr-editor";
import {todayISO} from "@/lib/dpr";
export default async function DPRTodayPage({searchParams}:{searchParams:Promise<{project?:string;date?:string}>}){const query=await searchParams;return <DPREditor projectId={query.project??"commercial-tower"} date={query.date??todayISO()}/>}
