import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  createClient,
  type EmailOtpType,
  type Session,
} from "@supabase/supabase-js";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import "../styles.css";
import { CarCatalog } from "../components/CarCatalog";
import { API } from "../lib/api";

export const Route = createFileRoute("/")({ component: Home });

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

type UserProfile = { id: string; email: string; createdAt: string };

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: string;
  className?: string;
}) {
  const paths: Record<string, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    leaf: (
      <>
        <path d="M20 4c-8 0-14 3-14 10a5 5 0 0 0 5 5c7 0 9-7 9-15Z" />
        <path d="M4 21c2-5 6-8 11-10" />
      </>
    ),
    key: (
      <>
        <circle cx="8" cy="15" r="4" />
        <path d="m11 12 8-8 2 2-2 2 1 1-2 2-1-1-2 2" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
  };
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const accountEmail = session?.user.email;
  const accessToken = session?.access_token;
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["profile", accessToken],
    queryFn: ({ signal }) =>
      API<UserProfile>("/api/users/me", {
        method: "POST",
        accessToken,
        signal,
        errorMessage: "Não foi possível carregar sua conta. Tente novamente.",
      }),
    enabled: Boolean(session),
    retry: false,
  });

  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    let active = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setSession(session);
    });
    const params = new URLSearchParams(window.location.search);
    const tokenHash = params.get("token_hash");
    if (tokenHash) {
      setVerifying(true);
      supabase.auth
        .verifyOtp({
          token_hash: tokenHash,
          type: (params.get("type") || "email") as EmailOtpType,
        })
        .then(({ error }) => {
          if (!active) return;
          setMessage(
            error
              ? {
                  type: "error",
                  text: "Não foi possível confirmar seu link. Solicite um novo link para entrar.",
                }
              : {
                  type: "success",
                  text: "Você entrou na sua conta e já pode começar.",
                },
          );
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
          setVerifying(false);
        });
    }
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setMessage(
      error
        ? {
            type: "error",
            text: "Não foi possível enviar o link. Confira seu e-mail e tente novamente.",
          }
        : {
            type: "success",
            text: "Confira sua caixa de entrada. O link de acesso pode levar alguns instantes para chegar.",
          },
    );
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error)
      setMessage({
        type: "error",
        text: "Não foi possível sair da conta. Tente novamente.",
      });
    else {
      setSession(null);
      setMessage(null);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9f4] text-[#173c2d] selection:bg-[#d4eac7]">
      <header className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 sm:px-10 lg:px-16">
        <a
          href="#top"
          className="flex items-center gap-2.5 text-[22px] font-bold tracking-[-0.06em]"
          aria-label="Página inicial da Rent a Car"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1d533b] text-[#e3f3cc]">
            <Icon name="leaf" className="h-5 w-5" />
          </span>
          Rent a Car<span className="text-[#83a476]">.</span>
        </a>
        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-10 text-[13px] font-semibold text-[#476052] md:flex"
        >
          <a className="transition hover:text-[#1c6a43]" href="#how-it-works">
            Para sua viagem
          </a>
          <a className="transition hover:text-[#1c6a43]" href="#why-rent-a-car">
            Inspirações
          </a>
          {accountEmail && (
            <a className="transition hover:text-[#1c6a43]" href="#cars">
              Nossos carros
            </a>
          )}
        </nav>
        {accountEmail ? (
          <a
            href="#account"
            aria-label={`Minha conta: ${accountEmail}`}
            title="Minha conta"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#cbdcca] bg-[#e4f0df] text-sm font-semibold uppercase text-[#315e3e] transition hover:border-[#1d533b] hover:bg-[#d5e9cf] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d533b]"
          >
            {accountEmail
              .split("@")[0]
              .split(/[._-]+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0])
              .join("") || "U"}
          </a>
        ) : (
          <a
            href="#account"
            className="rounded-full border border-[#b9caba] px-5 py-2.5 text-[13px] font-semibold transition hover:border-[#1d533b] hover:bg-[#edf4e9]"
          >
            Entrar <span className="ml-2">↗</span>
          </a>
        )}
      </header>

      <main id="top">
        <section className="mx-auto grid max-w-[1440px] gap-10 px-6 pb-12 pt-8 sm:px-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16 lg:px-16 lg:pb-20 lg:pt-10">
          <div className="max-w-[590px] py-3 lg:py-8">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d5e4d1] bg-[#eff6e9] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#51805b]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#79a96f]" /> Aluguel
              de carros
            </div>
            <h1 className="text-[clamp(3.5rem,6.4vw,6.1rem)] font-medium leading-[0.99] tracking-[-0.075em]">
              Seu caminho,
              <br />
              <span className="text-[#7eaa78]">seu ritmo.</span>
            </h1>
            <p className="mt-7 max-w-[420px] text-[16px] leading-7 text-[#708175] sm:text-[17px]">
              Um carro para acompanhar seus planos, seja para explorar um lugar
              novo ou circular pela cidade.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <a
                href="#account"
                className="inline-flex items-center gap-8 rounded-full bg-[#1b5239] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#286b4b]"
              >
                Começar <Icon name="arrow" className="h-4 w-4" />
              </a>
              <a
                href="#how-it-works"
                className="border-b border-[#98ad9a] pb-1 text-sm font-semibold text-[#355746] transition hover:text-[#78a573]"
              >
                Inspire-se
              </a>
            </div>
            <div className="mt-12 flex items-center gap-3 text-xs text-[#75887a]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e6f0df] text-[#638f68]">
                <Icon name="leaf" className="h-4 w-4" />
              </div>
              <span>Boas viagens começam aqui.</span>
            </div>
          </div>
          <div className="relative min-h-[390px] overflow-hidden rounded-[10px] bg-[#c4d8bb] sm:min-h-[500px] lg:min-h-[570px]">
            <img
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1400&q=85"
              alt="Um passeio tranquilo por uma estrada cercada de árvores"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#173b2b]/65 via-transparent to-[#173b2b]/5" />
            <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between gap-4 text-white sm:bottom-9 sm:left-9 sm:right-9">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/75">
                  Aproveite o caminho
                </p>
                <p className="text-2xl font-medium tracking-[-0.04em] sm:text-3xl">
                  Um pouco mais de liberdade.
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/60">
                <Icon name="arrow" />
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-y border-[#e3ebe0] bg-[#eef4e9] px-6 py-14 sm:px-10 lg:px-16 lg:py-20"
        >
          <div className="mx-auto max-w-[1312px]">
            <div className="mb-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#789675]">
                  Feito para ir mais longe
                </p>
                <h2 className="text-3xl font-medium tracking-[-0.05em] sm:text-4xl">
                  Para onde você quer ir?
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-6 text-[#778b7a]">
                Do trajeto de sempre a uma viagem especial, há muitos caminhos
                para descobrir.
              </p>
            </div>
            <div
              id="why-rent-a-car"
              className="grid gap-8 border-t border-[#d6e4d2] pt-8 md:grid-cols-3 md:gap-12"
            >
              {[
                {
                  icon: "key",
                  number: "01",
                  title: "Pela cidade",
                  text: "Para seus compromissos, encontros e passeios pela cidade.",
                },
                {
                  icon: "clock",
                  number: "02",
                  title: "Um fim de semana fora",
                  text: "Escolha um destino, prepare as malas e aproveite a viagem.",
                },
                {
                  icon: "shield",
                  number: "03",
                  title: "Novos caminhos",
                  text: "Conheça novos lugares e descubra o que há pelo caminho.",
                },
              ].map((item) => (
                <div key={item.number}>
                  <div className="mb-5 flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dbead5] text-[#578963]">
                      <Icon name={item.icon} />
                    </span>
                    <span className="text-xs text-[#a2b5a0]">
                      {item.number} / 03
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold tracking-[-0.03em]">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-[#7b8e7e]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
              Informe seu e-mail para receber um link de acesso à sua conta.
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
                  Confirmando seu link de acesso…
                </p>
              </>
            ) : accountEmail ? (
              <>
                <h3 className="text-xl font-semibold tracking-[-0.03em]">
                  Você está conectado.
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#7b8e7e]">
                  Conectado como{" "}
                  <span className="font-medium text-[#355746]">
                    {accountEmail}
                  </span>
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
                      <dd>
                        {new Date(profile.createdAt).toLocaleString("pt-BR")}
                      </dd>
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
                  Vamos começar.
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#7b8e7e]">
                  Sem senha para lembrar. Apenas seu e-mail.
                </p>
                <form onSubmit={handleLogin} className="mt-6">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-semibold text-[#496653]"
                  >
                    Endereço de e-mail
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="voce@exemplo.com"
                      value={email}
                      required
                      onChange={(event) => setEmail(event.target.value)}
                      className="min-w-0 flex-1 rounded-lg border border-[#dce7da] bg-[#fafcf8] px-4 py-3.5 text-sm outline-none placeholder:text-[#a7b5a8] focus:border-[#78a779] focus:ring-2 focus:ring-[#dcecd5]"
                    />
                    <button
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-3 rounded-lg bg-[#1b5239] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#286b4b] disabled:opacity-60"
                    >
                      {loading ? "Enviando…" : "Enviar link de acesso"}
                      <Icon name="arrow" className="h-4 w-4" />
                    </button>
                  </div>
                </form>
                <p className="mt-4 text-xs leading-5 text-[#9aab9c]">
                  Enviaremos um link seguro para você entrar.
                </p>
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
        {accountEmail && accessToken && (
          <CarCatalog accessToken={accessToken} />
        )}
      </main>
      <footer className="border-t border-[#e5ece2] px-6 py-7 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1312px] flex-col justify-between gap-3 text-xs text-[#94a495] sm:flex-row">
          <span className="font-bold tracking-[-0.04em] text-[#41644d]">
            Rent a Car.
          </span>
          <span>Feito para a viagem, onde quer que ela leve você.</span>
        </div>
      </footer>
    </div>
  );
}
