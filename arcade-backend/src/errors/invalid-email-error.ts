import { ApplicationError } from "@/protocols";
import httpStatus from "http-status";

export function invalidEmailError(email: string): ApplicationEmailError {
  return {
    name: "InvalidEmailError",
    email: email,
    message: `"${email}" is not a valid email!`,
    statusCode: httpStatus.FORBIDDEN,
  };
}

export type ApplicationEmailError = ApplicationError & { email: string };
