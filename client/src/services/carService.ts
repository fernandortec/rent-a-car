import { API } from "./api";
import type { Car } from "../types";
export function getCars(accessToken: string, signal?: AbortSignal) {
	return API<Car[]>("/api/cars", { accessToken, signal });
}
