import {projects} from "@/data/mock-data";
import type {Project} from "@/types";

export const defaultProject=projects[0];
export function resolveProject(projectId?:string|null):Project{return projects.find(project=>project.id===projectId)??defaultProject}
