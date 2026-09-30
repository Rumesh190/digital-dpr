import {DPREditor} from "@/components/dpr/dpr-editor";
import {todayISO} from "@/lib/dpr";import {defaultProject,resolveProject} from "@/lib/projects";
export default async function DPRTodayPage({searchParams}:{searchParams:Promise<{project?:string;date?:string}>}){const query=await searchParams;const project=resolveProject(query.project??defaultProject.id);return <DPREditor projectId={project.id} date={query.date??todayISO()}/>}
