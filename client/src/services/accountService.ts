import { createClient } from "@supabase/supabase-js";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
type Credentials = { email: string; password: string };
export function subscribeToAuth(
	callback: (event: AuthChangeEvent, session: Session | null) => void,
) {
	return supabase.auth.onAuthStateChange(callback);
}
export function signUp(credentials: Credentials) {
	return supabase.auth.signUp(credentials);
}
export function signIn(credentials: Credentials) {
	return supabase.auth.signInWithPassword(credentials);
}
export function signOut() {
	return supabase.auth.signOut();
}
