import {projects} from "@/data/mock-data";
import type {Project} from "@/types";

export const defaultProject=projects[0];
export const isValidProjectId=(projectId?:string|null)=>projects.some(project=>project.id===projectId);
export function resolveProject(projectId?:string|null):Project{return projects.find(project=>project.id===projectId)??defaultProject}
export const DEFAULT_PROJECT_KEY="digital-dpr:default-project";
export const DEFAULT_PROJECT_CHANGE_EVENT="digital-dpr:default-project-change";
export function getDefaultProjectId(){if(typeof window==="undefined")return null;const stored=localStorage.getItem(DEFAULT_PROJECT_KEY);if(projects.some(project=>project.id===stored))return stored;localStorage.removeItem(DEFAULT_PROJECT_KEY);return null}
export function setDefaultProjectId(projectId:string){if(!projects.some(project=>project.id===projectId))return false;localStorage.setItem(DEFAULT_PROJECT_KEY,projectId);window.dispatchEvent(new CustomEvent(DEFAULT_PROJECT_CHANGE_EVENT));return true}
export function resolvePreferredProject(projectId?:string|null){const explicit=projects.find(project=>project.id===projectId);if(explicit)return explicit;return resolveProject(getDefaultProjectId())}
