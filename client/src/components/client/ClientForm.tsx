import type { Dispatch, SetStateAction, FormEvent } from "react";
import type { Client } from "../../types";
type Props = {
	client: Client | null;
	form: Client;
	setForm: Dispatch<SetStateAction<Client>>;
	busy: boolean;
	save: (event: FormEvent<HTMLFormElement>) => void;
	remove: () => void;
};
export function ClientForm({
	client,
	form,
	setForm,
	busy,
	save,
	remove,
}: Props) {
	return (
		<section>
			<p className="eyebrow">01 / SEUS DADOS</p>
			<h2>Meu cadastro</h2>
			<p className="section-description">
				Mantenha suas informações em dia para alugar.
			</p>
			<form onSubmit={save}>
				<label>
					Nome
					<input
						required
						maxLength={160}
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
					/>
				</label>
				<label>
					CPF
					<input
						required
						pattern="[0-9]{11}"
						maxLength={11}
						title="11 dígitos, sem pontuação"
						value={form.cpf}
						onChange={(e) => setForm({ ...form, cpf: e.target.value })}
					/>
				</label>
				<label>
					Endereço
					<input
						required
						maxLength={255}
						value={form.address}
						onChange={(e) => setForm({ ...form, address: e.target.value })}
					/>
				</label>
				<button disabled={busy}>
					{client ? "Salvar alterações" : "Cadastrar cliente"}
				</button>
				{client && (
					<button type="button" disabled={busy} onClick={remove}>
						Excluir cadastro
					</button>
				)}
			</form>
		</section>
	);
}
