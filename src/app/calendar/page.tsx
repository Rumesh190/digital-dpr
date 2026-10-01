import {CalendarWorkspace} from "@/components/project/calendar-workspace";
import {ProjectEntry} from "@/components/project/project-entry";
import {isValidProjectId,resolveProject} from "@/lib/projects";
export default async function CalendarPage({searchParams}:{searchParams:Promise<{date?:string;project?:string}>}){const query=await searchParams;if(!isValidProjectId(query.project))return <ProjectEntry route="/calendar" params={{date:query.date}}/>;return <CalendarWorkspace initialDate={query.date} projectId={resolveProject(query.project).id}/>}
