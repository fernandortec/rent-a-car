import type { FormEvent } from "react";
import type { Car } from "../../types";
type Props = {
	client: boolean;
	cars: Car[];
	busy: boolean;
	request: (event: FormEvent<HTMLFormElement>) => void;
};
export function RentalForm({ client, cars, busy, request }: Props) {
	return (
		<section>
			<p className="eyebrow">02 / PRÓXIMA VIAGEM</p>
			<h2>Novo pedido de aluguel</h2>
			<p className="section-description">
				Escolha seu carro e o período que precisa.
			</p>
			{!client ? (
				<p>Complete seu cadastro para solicitar um aluguel.</p>
			) : !cars.length ? (
				<p>Nenhum carro cadastrado.</p>
			) : (
				<form onSubmit={request}>
					<label>
						Carro
						<select name="carId" required>
							{cars.map((car) => (
								<option key={car.id} value={car.id}>
									{car.brand} {car.model} ({car.year})
								</option>
							))}
						</select>
					</label>
					<label>
						Retirada
						<input name="startDate" type="date" required />
					</label>
					<label>
						Devolução
						<input name="endDate" type="date" required />
					</label>
					<button disabled={busy}>Criar pedido</button>
				</form>
			)}
		</section>
	);
}
