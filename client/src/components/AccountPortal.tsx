import { useAccountPortal } from "../hooks/useAccountPortal";
import { ClientForm } from "./client/ClientForm";
import { RentalForm } from "./rental/RentalForm";
import { RentalList } from "./rental/RentalList";
export function AccountPortal({ accessToken }: { accessToken: string }) {
	const account = useAccountPortal(accessToken);
	return (
		<>
			{account.message && <p role="status">{account.message}</p>}
			{!account.ready ? (
				<p>Carregando cadastro... Se ocorrer um erro, recarregue a página.</p>
			) : (
				<>
					<p className="account-type">
						Conta: {account.agent ? `Agente — ${account.agent}` : "Cliente"}
					</p>
					<div className="portal-grid">
						<ClientForm
							client={account.client}
							form={account.form}
							setForm={account.setForm}
							busy={account.busy}
							save={account.save}
							remove={account.remove}
						/>
						<RentalForm
							client={Boolean(account.client)}
							cars={account.cars}
							busy={account.busy}
							request={account.request}
						/>
					</div>
					<RentalList rentals={account.rentals} />
				</>
			)}
		</>
	);
}
