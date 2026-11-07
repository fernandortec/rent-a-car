export class APIError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

type APIOptions = RequestInit & {
  accessToken?: string;
  errorMessage?: string;
  unauthorizedMessage?: string;
};

export async function API<T>(
  path: string,
  {
    accessToken,
    errorMessage = "Não foi possível concluir a solicitação. Tente novamente.",
    unauthorizedMessage = errorMessage,
    headers,
    ...options
  }: APIOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);
  if (options.body) requestHeaders.set("Content-Type", "application/json");
  if (accessToken) requestHeaders.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(
    `${apiUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`,
    { ...options, headers: requestHeaders },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new APIError(
      response.status,
      response.status === 401
        ? unauthorizedMessage
        : body?.message || errorMessage,
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}
