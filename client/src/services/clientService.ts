import { API, APIError } from "./api";
import type { Client } from "../types";
export async function getClient(accessToken: string, signal?: AbortSignal) {
	try {
		return await API<Client>("/api/clients/me", { accessToken, signal });
	} catch (error) {
		if (error instanceof APIError && error.status === 404) return null;
		throw error;
	}
}
export function saveClient(
	accessToken: string,
	client: Client,
	exists: boolean,
) {
	return API<Client>("/api/clients/me", {
		accessToken,
		method: exists ? "PUT" : "POST",
		body: JSON.stringify(client),
	});
}
export function deleteClient(accessToken: string) {
	return API<void>("/api/clients/me", { accessToken, method: "DELETE" });
}
