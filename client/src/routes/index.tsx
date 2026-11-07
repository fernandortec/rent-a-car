import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import { AuthForm } from "../components/auth/AuthForm";
import { AccountPortal } from "../components/AccountPortal";
export const Route = createFileRoute("/")({ component: Home });
function Home() {
	const auth = useAuth();
	return (
		<main>
			<header className="app-header">
				<a className="brand" href="/" aria-label="Rent a Car, início">
					<span className="brand-symbol" aria-hidden="true">
						r.
					</span>
					rent a car<span className="brand-dot">®</span>
				</a>
				<span className="header-note">Simples. Do início ao destino.</span>
			</header>
			<div className="page-heading">
				<p className="eyebrow">SEU PRÓXIMO CAMINHO</p>
				<h1>
					{auth.session
						? "Tudo pronto para partir."
						: "Seu caminho começa aqui."}
				</h1>
				<p>Escolha um carro, faça seu pedido e acompanhe por aqui.</p>
			</div>
			{!auth.ready ? (
				<p>Carregando...</p>
			) : auth.session ? (
				<>
					<p className="account-bar">
						{auth.session.user.email}{" "}
						<button disabled={auth.busy} onClick={auth.logout}>
							Sair
						</button>
					</p>
					<AccountPortal
						key={auth.session.user.id}
						accessToken={auth.session.access_token}
					/>
				</>
			) : (
				<AuthForm
					signup={auth.signup}
					busy={auth.busy}
					submit={auth.submit}
					toggleMode={auth.toggleMode}
				/>
			)}
			{auth.message && <p role="status">{auth.message}</p>}
		</main>
	);
}
