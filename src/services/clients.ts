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
  return await httpRequest<clintDto>({ method: "GET", path: `/customers/${id}` });
}


