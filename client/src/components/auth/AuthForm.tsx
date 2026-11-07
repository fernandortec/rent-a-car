import type { useAuth } from "../../hooks/useAuth";
type Props = Pick<
	ReturnType<typeof useAuth>,
	"signup" | "busy" | "submit" | "toggleMode"
>;
export function AuthForm({ signup, busy, submit, toggleMode }: Props) {
	return (
		<section className="auth-card">
			<p className="eyebrow">BEM-VINDO À RENT A CAR</p>
			<h2>{signup ? "Crie sua conta" : "Entre na sua conta"}</h2>
			<p>Seus dados e pedidos em um só lugar.</p>
			<form onSubmit={submit}>
				<label>
					E-mail
					<input name="email" type="email" autoComplete="email" required />
				</label>
				<label>
					Senha
					<input
						name="password"
						type="password"
						minLength={8}
						autoComplete={signup ? "new-password" : "current-password"}
						required
					/>
				</label>
				<button disabled={busy}>{signup ? "Cadastrar" : "Entrar"}</button>
			</form>
			<button disabled={busy} onClick={toggleMode}>
				{signup ? "Já tenho conta" : "Criar conta"}
			</button>
		</section>
	);
}
