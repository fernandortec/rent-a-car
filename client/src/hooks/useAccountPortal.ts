import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Client, Car, Rental } from "../types";
import { getClient, saveClient, deleteClient } from "../services/clientService";
import { getRentals, createRental } from "../services/rentalService";
import { getCars } from "../services/carService";
import { getAgent } from "../services/agentService";
const empty: Client = { name: "", cpf: "", address: "" };
export function useAccountPortal(accessToken: string) {
	const [client, setClient] = useState<Client | null>(null);
	const [form, setForm] = useState(empty);
	const [cars, setCars] = useState<Car[]>([]);
	const [rentals, setRentals] = useState<Rental[]>([]);
	const [agent, setAgent] = useState<string | null>(null);
	const [ready, setReady] = useState(false);
	const [busy, setBusy] = useState(false);
	const [message, setMessage] = useState("");
	useEffect(() => {
		const controller = new AbortController();
		async function load() {
			setReady(false);
			setMessage("");
			try {
				const [profile, vehicles, orders, employee] = await Promise.all([
					getClient(accessToken, controller.signal),
					getCars(accessToken, controller.signal),
					getRentals(accessToken, controller.signal),
					getAgent(accessToken, controller.signal),
				]);
				if (controller.signal.aborted) return;
				setClient(profile);
				setForm(profile || empty);
				setCars(vehicles);
				setRentals(orders);
				setAgent(employee?.name || null);
				setReady(true);
			} catch (error) {
				if (!controller.signal.aborted)
					setMessage(
						error instanceof Error ? error.message : "Erro ao carregar.",
					);
			}
		}
		void load();
		return () => controller.abort();
	}, [accessToken]);
	async function save(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setBusy(true);
		setMessage("");
		try {
			const saved = await saveClient(accessToken, form, Boolean(client));
			setClient(saved);
			setForm(saved);
			setMessage("Cadastro salvo.");
		} catch (error) {
			setMessage(error instanceof Error ? error.message : "Erro ao salvar.");
		} finally {
			setBusy(false);
		}
	}
	async function remove() {
		if (
			!window.confirm(
				"Excluir seu cadastro e seus pedidos? A conta de login será mantida.",
			)
		)
			return;
		setBusy(true);
		setMessage("");
		try {
			await deleteClient(accessToken);
			setClient(null);
			setForm(empty);
			setRentals([]);
			setMessage("Cadastro excluído.");
		} catch (error) {
			setMessage(error instanceof Error ? error.message : "Erro ao excluir.");
		} finally {
			setBusy(false);
		}
	}
	async function request(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setBusy(true);
		setMessage("");
		const data = new FormData(event.currentTarget);
		try {
			const rental = await createRental(accessToken, {
				carId: Number(data.get("carId")),
				startDate: String(data.get("startDate")),
				endDate: String(data.get("endDate")),
			});
			setRentals((previous) => [rental, ...previous]);
			setMessage("Pedido criado.");
		} catch (error) {
			setMessage(
				error instanceof Error ? error.message : "Erro ao criar pedido.",
			);
		} finally {
			setBusy(false);
		}
	}
	return {
		client,
		form,
		setForm,
		cars,
		rentals,
		agent,
		ready,
		busy,
		message,
		save,
		remove,
		request,
	};
}
