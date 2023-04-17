import { ApplicationError } from "@/protocols";
import httpStatus from "http-status";

export function invalidDataError(
	details: string[],
	statusCode?: number
): ApplicationInvalidateDataError {
	return {
		name: "InvalidDataError",
		message: "Invalid data",
		statusCode: statusCode || httpStatus.UNAUTHORIZED,
		details,
	};
}

type ApplicationInvalidateDataError = ApplicationError & {
	details: string[];
};
