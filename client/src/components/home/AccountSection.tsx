import { Icon } from "./Icon";
import type { useHomeAccount } from "./useHomeAccount";

export function AccountSection({
  account,
}: {
  account: ReturnType<typeof useHomeAccount>;
}) {
  const {
    accountEmail,
    loading,
    email,
    setEmail,
    password,
    setPassword,
    authMode,
    updatingPassword,
    profile,
    profileLoading,
    profileError,
    refetchProfile,
    verifying,
    message,
    handleAuth,
    changeAuthMode,
    handleLogout,
  } = account;
  return (
    <section
      id="account"
      className="mx-auto grid max-w-[1312px] gap-10 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:items-center lg:gap-24 lg:px-0 lg:py-28"
    >
      <div>
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#83a180]">
          Sua próxima viagem espera por você
        </p>
        <h2 className="max-w-lg text-4xl font-medium leading-[1.08] tracking-[-0.055em] sm:text-5xl">
          Tudo pronto
          <br />
          <span className="text-[#85aa7e]">para você.</span>
        </h2>
        <p className="mt-5 max-w-md text-[15px] leading-7 text-[#798b7d]">
          Crie sua conta ou entre com seu e-mail e senha para escolher seu
          carro.
        </p>
      </div>
      <div className="rounded-2xl border border-[#e0e9dc] bg-white p-7 shadow-[0_16px_50px_rgba(37,77,48,0.05)] sm:p-10">
        <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-[#edf5e9] text-[#5d8b64]">
          <Icon name="mail" />
        </div>
        {verifying ? (
          <>
            <h3 className="text-xl font-semibold tracking-[-0.03em]">
              Um momento
            </h3>
            <p className="mt-2 text-sm text-[#7b8e7e]">
              Confirmando seu e-mail…
            </p>
          </>
        ) : accountEmail && !updatingPassword ? (
          <>
            <h3 className="text-xl font-semibold tracking-[-0.03em]">
              Você está conectado.
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#7b8e7e]">
              Conectado como{" "}
              <span className="font-medium text-[#355746]">{accountEmail}</span>
            </p>
            {profileLoading && (
              <p role="status" className="mt-4 text-sm text-[#7b8e7e]">
                Carregando sua conta…
              </p>
            )}
            {profile && (
              <dl className="mt-5 space-y-3 text-sm">
                <div>
                  <dt className="font-semibold">E-mail</dt>
                  <dd>{profile.email}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Identificação</dt>
                  <dd className="break-all text-[#7b8e7e]">{profile.id}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Conta criada em</dt>
                  <dd>{new Date(profile.createdAt).toLocaleString("pt-BR")}</dd>
                </div>
              </dl>
            )}
            {profileError && (
              <div role="alert" className="mt-4 text-sm text-red-700">
                <p>{profileError.message}</p>
                <button
                  className="mt-2 underline"
                  onClick={() => void refetchProfile()}
                >
                  Tentar novamente
                </button>
              </div>
            )}
            <button
              onClick={handleLogout}
              disabled={loading}
              className="mt-6 rounded-full border border-[#b9caba] px-5 py-3 text-sm font-semibold transition hover:bg-[#edf4e9] disabled:opacity-60"
            >
              {loading ? "Saindo…" : "Sair"}
            </button>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold tracking-[-0.03em]">
              {updatingPassword
                ? "Defina sua nova senha."
                : authMode === "signup"
                  ? "Crie sua conta."
                  : authMode === "reset"
                    ? "Recupere sua senha."
                    : "Entre na sua conta."}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#7b8e7e]">
              {updatingPassword
                ? "Escolha uma senha com pelo menos 8 caracteres."
                : authMode === "reset"
                  ? "Enviaremos as instruções para seu e-mail."
                  : "Use seu e-mail e senha para acessar."}
            </p>
            <form onSubmit={handleAuth} className="mt-6 space-y-4">
              {!updatingPassword && (
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-semibold text-[#496653]"
                  >
                    Endereço de e-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="voce@exemplo.com"
                    value={email}
                    required
                    disabled={loading}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-lg border border-[#dce7da] bg-[#fafcf8] px-4 py-3.5 text-sm outline-none focus:border-[#78a779] focus:ring-2 focus:ring-[#dcecd5]"
                  />
                </div>
              )}
              {(updatingPassword || authMode !== "reset") && (
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-semibold text-[#496653]"
                  >
                    {updatingPassword ? "Nova senha" : "Senha"}
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete={
                      authMode === "signup" || updatingPassword
                        ? "new-password"
                        : "current-password"
                    }
                    minLength={
                      authMode === "signup" || updatingPassword ? 8 : undefined
                    }
                    value={password}
                    required
                    disabled={loading}
                    onChange={(event) => setPassword(event.target.value)}
                    aria-describedby={
                      authMode === "signup" || updatingPassword
                        ? "password-help"
                        : undefined
                    }
                    className="w-full rounded-lg border border-[#dce7da] bg-[#fafcf8] px-4 py-3.5 text-sm outline-none focus:border-[#78a779] focus:ring-2 focus:ring-[#dcecd5]"
                  />
                  {(authMode === "signup" || updatingPassword) && (
                    <p
                      id="password-help"
                      className="mt-2 text-xs text-[#798b7d]"
                    >
                      Use pelo menos 8 caracteres.
                    </p>
                  )}
                </div>
              )}
              <button
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-[#1b5239] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#286b4b] disabled:opacity-60"
              >
                {loading
                  ? "Aguarde…"
                  : updatingPassword
                    ? "Salvar nova senha"
                    : authMode === "signup"
                      ? "Criar conta"
                      : authMode === "reset"
                        ? "Enviar instruções"
                        : "Entrar"}
                <Icon name="arrow" className="h-4 w-4" />
              </button>
            </form>
            {!updatingPassword && (
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#47724c]">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    changeAuthMode(authMode === "login" ? "signup" : "login")
                  }
                  className="underline disabled:opacity-60"
                >
                  {authMode === "login"
                    ? "Não tem conta? Cadastre-se"
                    : "Já tem conta? Entre"}
                </button>
                {authMode === "login" && (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => changeAuthMode("reset")}
                    className="underline disabled:opacity-60"
                  >
                    Esqueci minha senha
                  </button>
                )}
              </div>
            )}
          </>
        )}
        {message && (
          <p
            role="status"
            className={`mt-5 rounded-lg px-4 py-3 text-sm leading-6 ${message.type === "error" ? "bg-red-50 text-red-700" : "bg-[#eef7e9] text-[#47724c]"}`}
          >
            {message.text}
          </p>
        )}
      </div>
    </section>
  );
}
