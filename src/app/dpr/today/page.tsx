import {DPREditor} from "@/components/dpr/dpr-editor";
import {ProjectEntry} from "@/components/project/project-entry";
import {todayISO} from "@/lib/dpr";
import {isValidProjectId,resolveProject} from "@/lib/projects";
export default async function DPRTodayPage({searchParams}:{searchParams:Promise<{project?:string;date?:string}>}){const query=await searchParams;if(!isValidProjectId(query.project))return <ProjectEntry route="/dpr/today" params={{date:query.date??todayISO()}}/>;return <DPREditor projectId={resolveProject(query.project).id} date={query.date??todayISO()}/>}
