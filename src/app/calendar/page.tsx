import {CalendarWorkspace} from "@/components/project/calendar-workspace";
export default async function CalendarPage({searchParams}:{searchParams:Promise<{date?:string}>}){const query=await searchParams;return <CalendarWorkspace initialDate={query.date}/>}
