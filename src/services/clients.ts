import { httpRequest } from "./http";

export interface clintDto {
  id: string;
  name?: string | null;
  customer_status:string;
  project_status:string;
  project_requirements?:string;
}

export async function fetchClients(): Promise<clintDto[]> {
  return await httpRequest<clintDto[]>({ method: "GET", path: "/customers/" });
}

export async function fetchClient(id: string): Promise<clintDto> {
  return await httpRequest<clintDto>({ method: "GET", path: `/customers/${id}/` });
}

export async function createClient(data: clintDto): Promise<clintDto> {
  return await httpRequest<clintDto, clintDto>({ method: "POST", path: "/customers/", body: data });
}
export async function updateClient(id: string, data: Partial<clintDto>): Promise<clintDto> {
  return await httpRequest<clintDto, Partial<clintDto>>({ method: "PUT", path: `/customers/${id}/`, body: data });
}
export async function deleteClient(id: string): Promise<void> {
  await httpRequest<void>({ method: "DELETE", path: `/customers/${id}/` });
}
export async function bulkDeleteClients(ids: string[]): Promise<void> {
  await httpRequest<void, { ids: string[] }>({ method: "POST", path: "/customers/bulk-delete/", body: { ids } });
}



