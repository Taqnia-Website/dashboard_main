import { httpRequest } from "./http";

export interface ProjectDto {
  id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  status?: string | null;
  technologies?: string[] | null;
  created_at: string;
  updated_at: string;
}

export type CreateProjectDto = Omit<ProjectDto, "id" | "created_at" | "updated_at">;
export type UpdateProjectDto = Partial<CreateProjectDto> & { id: string };

export async function fetchProjects(): Promise<ProjectDto[]> {
  return await httpRequest<ProjectDto[]>({ method: "GET", path: "/projects" });
}

export async function createProject(data: CreateProjectDto): Promise<ProjectDto> {
  return await httpRequest<ProjectDto, CreateProjectDto>({ method: "POST", path: "/projects", body: data });
}

export async function updateProject(id: string, data: Partial<CreateProjectDto>): Promise<ProjectDto> {
  return await httpRequest<ProjectDto, Partial<CreateProjectDto>>({ method: "PUT", path: `/projects/${id}`, body: data });
}

export async function deleteProject(id: string): Promise<void> {
  await httpRequest<void>({ method: "DELETE", path: `/projects/${id}` });
}

export async function bulkDeleteProjects(ids: string[]): Promise<void> {
  await httpRequest<void, { ids: string[] }>({ method: "POST", path: "/projects/bulk-delete", body: { ids } });
}


