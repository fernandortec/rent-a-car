export type Client = { name: string; cpf: string; address: string };
export type Car = { id: number; brand: string; model: string; year: number };
export type Rental = {
	id: number;
	car: Car;
	startDate: string;
	endDate: string;
	status: string;
};
