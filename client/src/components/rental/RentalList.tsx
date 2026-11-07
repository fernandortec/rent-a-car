import type { Rental } from "../../types";
function date(value: string) {
	return new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR");
}
export function RentalList({ rentals }: { rentals: Rental[] }) {
	return (
		<section className="rental-history">
			<div className="section-heading">
				<div>
					<p className="eyebrow">SEU HISTÓRICO</p>
					<h2>Meus pedidos</h2>
				</div>
				<span className="count">{rentals.length}</span>
			</div>
			{!rentals.length && (
				<div className="empty-state">
					<span aria-hidden="true">↗</span>
					<h3>Seu próximo caminho espera.</h3>
					<p>Quando fizer um pedido, você poderá acompanhar o status aqui.</p>
				</div>
			)}
			{rentals.map((rental) => (
				<article className="rental-row" key={rental.id}>
					<div>
						<p className="order-number">PEDIDO #{rental.id}</p>
						<h3>
							{rental.car.brand} {rental.car.model}
						</h3>
						<p>
							{date(rental.startDate)} <span aria-hidden="true">→</span>{" "}
							{date(rental.endDate)}
						</p>
					</div>
					<span className="status-badge">
						{rental.status === "PENDING" ? "Pendente" : rental.status}
					</span>
				</article>
			))}
		</section>
	);
}
