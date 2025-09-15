import { httpRequest } from "./http";

export interface ProjectDto {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  status?: string | null;
  tools?: string[] | null;
  created_at: string;
  updated_at: string;
}

export type CreateProjectDto = Omit<ProjectDto, "id" | "created_at" | "updated_at">;
export type UpdateProjectDto = Partial<CreateProjectDto> & { id: string };

export async function fetchProjects(): Promise<ProjectDto[]> {
  return await httpRequest<ProjectDto[]>({ method: "GET", path: "/api/company-projects/" });
}

export async function createProject(data: CreateProjectDto): Promise<ProjectDto> {
  return await httpRequest<ProjectDto, CreateProjectDto>({ method: "POST", path: "/api/company-projects/", body: data,formdata:true });
}

export async function updateProject(id: string, data: Partial<UpdateProjectDto>): Promise<ProjectDto> {
  return await httpRequest<ProjectDto, Partial<UpdateProjectDto>>({ method: "PUT", path: `/api/company-projects/${id}/`, body: data,formdata:true });
}

export async function deleteProject(id: string): Promise<void> {
  await httpRequest<void>({ method: "DELETE", path: `/api/company-projects/${id}/` });
}

export async function bulkDeleteProjects(ids: string[]): Promise<void> {
  await httpRequest<void, { ids: string[] }>({ method: "POST", path: "/api/company-projects/bulk-delete/", body: { ids } });
}


