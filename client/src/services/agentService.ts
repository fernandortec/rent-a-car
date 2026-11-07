import { API, APIError } from "./api";
export async function getAgent(accessToken: string, signal?: AbortSignal) {
	try {
		return await API<{ name: string }>("/api/agents/me", {
			accessToken,
			signal,
		});
	} catch (error) {
		if (error instanceof APIError && error.status === 403) return null;
		throw error;
	}
}
