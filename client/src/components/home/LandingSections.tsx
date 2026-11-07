import { Icon } from "./Icon";

export function Header({ accountEmail }: { accountEmail: string | undefined }) {
  return (
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
  );
}

export function Hero() {
  return (
    <section className="mx-auto grid max-w-[1440px] gap-10 px-6 pb-12 pt-8 sm:px-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16 lg:px-16 lg:pb-20 lg:pt-10">
      <div className="max-w-[590px] py-3 lg:py-8">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d5e4d1] bg-[#eff6e9] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#51805b]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#79a96f]" /> Aluguel de
          carros
        </div>
        <h1 className="text-[clamp(3.5rem,6.4vw,6.1rem)] font-medium leading-[0.99] tracking-[-0.075em]">
          Seu caminho,
          <br />
          <span className="text-[#7eaa78]">seu ritmo.</span>
        </h1>
        <p className="mt-7 max-w-[420px] text-[16px] leading-7 text-[#708175] sm:text-[17px]">
          Um carro para acompanhar seus planos, seja para explorar um lugar novo
          ou circular pela cidade.
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
  );
}

export function Inspiration() {
  return (
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
            Do trajeto de sempre a uma viagem especial, há muitos caminhos para
            descobrir.
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
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[#e5ece2] px-6 py-7 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-[1312px] flex-col justify-between gap-3 text-xs text-[#94a495] sm:flex-row">
        <span className="font-bold tracking-[-0.04em] text-[#41644d]">
          Rent a Car.
        </span>
        <span>Feito para a viagem, onde quer que ela leve você.</span>
      </div>
    </footer>
  );
}
