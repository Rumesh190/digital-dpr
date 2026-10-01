import {DPRReport} from "@/components/dpr/dpr-report";
import {ProjectEntry} from "@/components/project/project-entry";
import {todayISO} from "@/lib/dpr";
import {isValidProjectId,resolveProject} from "@/lib/projects";

export default async function ReportPage({searchParams}:{searchParams:Promise<{project?:string;date?:string}>}){const query=await searchParams;if(!isValidProjectId(query.project))return <ProjectEntry route="/dpr/report" params={{date:query.date??todayISO()}}/>;return <DPRReport projectId={resolveProject(query.project).id} date={query.date??todayISO()}/>}
