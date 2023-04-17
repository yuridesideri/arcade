import { ApplicationError } from "@/protocols";
import httpStatus from "http-status";

export function conflictError(message: string): ApplicationError {
  return {
    name: "ConflictError",
    message,
    statusCode: httpStatus.CONFLICT,
  };
}
