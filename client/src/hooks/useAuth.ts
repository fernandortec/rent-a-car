import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import {
	subscribeToAuth,
	signUp,
	signIn,
	signOut,
} from "../services/accountService";

export function useAuth() {
	const [session, setSession] = useState<Session | null>(null);
	const [ready, setReady] = useState(false);
	const [signup, setSignup] = useState(false);
	const [busy, setBusy] = useState(false);
	const [message, setMessage] = useState("");
	useEffect(() => {
		const {
			data: { subscription },
		} = subscribeToAuth((_event, next) => {
			setSession(next);
			setReady(true);
		});
		return () => subscription.unsubscribe();
	}, []);

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setBusy(true);
		setMessage("");
		const data = new FormData(event.currentTarget);
		const credentials = {
			email: String(data.get("email")).trim(),
			password: String(data.get("password")),
		};
		try {
			const { error } = signup
				? await signUp(credentials)
				: await signIn(credentials);
			if (error) throw error;
			setMessage(
				signup
					? "Conta criada. Confirme seu e-mail, se solicitado, e entre."
					: "",
			);
		} catch {
			setMessage(
				"Não foi possível entrar ou cadastrar. Confira os dados e a confirmação do e-mail.",
			);
		} finally {
			setBusy(false);
		}
	}
	async function logout() {
		setBusy(true);
		try {
			const { error } = await signOut();
			if (error) throw error;
			setMessage("");
		} catch {
			setMessage("Não foi possível sair. Tente novamente.");
		} finally {
			setBusy(false);
		}
	}
	function toggleMode() {
		setSignup(!signup);
		setMessage("");
	}
	return { session, ready, signup, busy, message, submit, logout, toggleMode };
}
