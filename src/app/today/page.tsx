import {ProjectEntry} from "@/components/project/project-entry";
import {TodayDashboard} from "@/components/project/today-dashboard";
import {isValidProjectId,resolveProject} from "@/lib/projects";
export default async function TodayPage({searchParams}:{searchParams:Promise<{project?:string}>}){const query=await searchParams;if(!isValidProjectId(query.project))return <ProjectEntry route="/today"/>;return <TodayDashboard projectId={resolveProject(query.project).id}/>}
