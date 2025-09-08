import { httpRequest } from "./http";

export interface UserDto {
  id: string;
  email: string;
  fullName?: string | null;
  role?: string | null;
  avatarUrl?: string | null;
  created_at?: string;
  updated_at?: string;
}

export async function fetchUsers(): Promise<UserDto[]> {
  return await httpRequest<UserDto[]>({ method: "GET", path: "/users" });
}

export async function fetchUser(id: string): Promise<UserDto> {
  return await httpRequest<UserDto>({ method: "GET", path: `/users/${id}` });
}


