import { useToast } from '@/components/ui/use-toast';
import { json } from 'stream/consumers';


export interface HttpClientConfig {
  baseUrl: string;
  getToken: () => string | null;
}

const defaultConfig: HttpClientConfig = {
  // baseUrl: import.meta.env.VITE_API_BASE_URL || "",
  baseUrl: import.meta.env.VITE_API_BASE_URL || "",
  getToken: () => localStorage.getItem("auth_token"),
};

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions<TBody = unknown> {
  method?: HttpMethod;
  path: string;
  body?: TBody;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  formdata?: boolean;
}

export async function httpRequest<TResponse, TBody = unknown>(

  options: RequestOptions<TBody>,
  config: HttpClientConfig = defaultConfig
): Promise<TResponse> {
  const { method = "GET", path, body, headers, signal, formdata } = options;
  const url = `${config.baseUrl}${path}`;

  const token = config.getToken();
  const requestHeaders: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  if (!formdata) {
    requestHeaders["Content-Type"] = "application/json";
  }
  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: !formdata && body != null ? JSON.stringify(body) : body as FormData,
    signal,
    credentials: "include",
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorJson = await response.json();
      message = (errorJson && (errorJson.message || errorJson.error)) || message;
      if (response.status == 401) {
        localStorage.removeItem("auth_token");
        window.location.href = "/auth";

      }

    } catch (_) {
      // ignore
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as unknown as TResponse;
  }
  if (response.status == 401) {
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
    useToast.prototype({ title: "تم تسجيل الخروج", description: "نراك قريباً" });
  }

  return (await response.json()) as TResponse;
}


