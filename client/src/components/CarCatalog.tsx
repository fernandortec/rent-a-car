import { useQuery } from "@tanstack/react-query";
import { API } from "../lib/api";

type Car = {
  id: number;
  registrationNumber: string;
  year: number;
  brand: string;
  model: string;
  licensePlate: string;
};

export function CarCatalog({
  accessToken,
}: {
  accessToken: string;
}) {
  const { data: cars = [], isPending: loading, error, refetch } = useQuery({
    queryKey: ["cars", accessToken],
    queryFn: ({ signal }) => API<Car[]>("/api/cars", {
      accessToken,
      signal,
      errorMessage: "Não foi possível carregar os carros. Tente novamente.",
      unauthorizedMessage: "Sua sessão expirou. Entre novamente para consultar os carros.",
    }),
    retry: false,
  });

  return (
    <section
      id="cars"
      aria-labelledby="cars-heading"
      className="border-t border-[#e3ebe0] bg-[#eef4e9] px-6 py-14 sm:px-10 lg:px-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1312px]">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#789675]">
          Conheça a frota
        </p>
        <h2
          id="cars-heading"
          className="text-3xl font-medium tracking-[-0.05em] sm:text-4xl"
        >
          Nossos carros
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#708175]">
          Consulte os automóveis cadastrados.
        </p>
        {loading ? (
          <p role="status" className="mt-8 text-sm text-[#476052]">
            Carregando carros…
          </p>
        ) : error ? (
          <div
            role="alert"
            className="mt-8 rounded-xl border border-red-200 bg-white p-6 text-sm text-red-700"
          >
            <p>{error.message}</p>
            <button
              onClick={() => void refetch()}
              className="mt-3 rounded-full border border-current px-4 py-2 font-semibold"
            >
              Tentar novamente
            </button>
          </div>
        ) : cars.length === 0 ? (
          <p className="mt-8 rounded-xl border border-[#d5e4d1] bg-white p-6 text-sm text-[#476052]">
            Ainda não há carros cadastrados. Volte em breve para conhecer a
            frota.
          </p>
        ) : (
          <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {cars.map((car) => (
              <li
                key={car.id}
                className="rounded-2xl border border-[#d5e4d1] bg-white p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-[#638f68]">
                  {car.brand}
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                  {car.model}
                </h3>
                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#708175]">Ano</dt>
                    <dd className="font-medium">{car.year}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#708175]">Placa</dt>
                    <dd className="font-medium">{car.licensePlate}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#708175]">Matrícula</dt>
                    <dd className="break-all text-right font-medium">
                      {car.registrationNumber}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
