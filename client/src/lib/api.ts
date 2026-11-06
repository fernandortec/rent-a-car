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
  if (accessToken) requestHeaders.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(
    `${apiUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`,
    { ...options, headers: requestHeaders },
  );

  if (!response.ok) {
    throw new Error(response.status === 401 ? unauthorizedMessage : errorMessage);
  }

  return response.json();
}
