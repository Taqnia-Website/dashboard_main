export interface HttpClientConfig {
  baseUrl: string;
  getToken: () => string | null;
}

const defaultConfig: HttpClientConfig = {
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
}

export async function httpRequest<TResponse, TBody = unknown>(
  options: RequestOptions<TBody>,
  config: HttpClientConfig = defaultConfig
): Promise<TResponse> {
  const { method = "GET", path, body, headers, signal } = options;
  const url = `${config.baseUrl}${path}`;

  const token = config.getToken();
  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body != null ? JSON.stringify(body) : undefined,
    signal,
    credentials: "include",
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorJson = await response.json();
      message = (errorJson && (errorJson.message || errorJson.error)) || message;
    } catch (_) {
      // ignore
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as unknown as TResponse;
  }

  return (await response.json()) as TResponse;
}


