import { ApplicationError } from "@/protocols";
import httpStatus from "http-status";

export function notFoundError(): ApplicationError {
  return {
    name: "NotFoundError",
    message: "No result for this search!",
    statusCode: httpStatus.NOT_FOUND,
  };
}
