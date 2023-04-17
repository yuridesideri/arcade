export type ApplicationError = {
	name: string;
	message: string;
	statusCode: number;
};

export type RequestError = {
	status: number;
	data: object | null;
	statusText: string;
	name: string;
	message: string;
};
