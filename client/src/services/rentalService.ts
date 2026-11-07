import { API } from "./api";
import type { Rental } from "../types";
export function getRentals(accessToken: string, signal?: AbortSignal) {
	return API<Rental[]>("/api/rentals", { accessToken, signal });
}
export function createRental(
	accessToken: string,
	input: { carId: number; startDate: string; endDate: string },
) {
	return API<Rental>("/api/rentals", {
		accessToken,
		method: "POST",
		body: JSON.stringify(input),
	});
}
