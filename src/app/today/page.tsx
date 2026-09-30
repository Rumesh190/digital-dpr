import {TodayDashboard} from "@/components/project/today-dashboard";import {defaultProject,resolveProject} from "@/lib/projects";
export default async function TodayPage({searchParams}:{searchParams:Promise<{project?:string}>}){const query=await searchParams;const project=resolveProject(query.project??defaultProject.id);return <TodayDashboard projectId={project.id}/>}
