import { ApplicationError } from "@/protocols";
import httpStatus from "http-status";

export function unauthorizedError(): ApplicationError {
  return {
    name: "UnauthorizedError",
    message: "You must be signed in to continue",
    statusCode: httpStatus.UNAUTHORIZED,
  };
}
