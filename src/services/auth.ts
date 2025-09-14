import {    httpRequest } from "./http";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;

  user: {
    id: string;
    email: string;
    fullName?: string | null;
    role?: string | null;
    avatarUrl?: string | null;
  };
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return await httpRequest<LoginResponse, LoginRequest>({
    method: "POST",
    path: "/api/login/",
    body: data,
  });
}

export async function getMe(): Promise<LoginResponse["user"]> {
  return await httpRequest<LoginResponse["user"]>({
    method: "GET",
    path: "/api/me/",
  });
}

export async function logout(): Promise<void> {
  await httpRequest<void>({
    method: "POST",
    path: "/api/logout",
  });
}


