import { ApplicationError } from "@/protocols";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

export function handleApplicationErrors(
  err: ApplicationError | Error,
  _req: Request,
  res: Response,
  next: NextFunction
) {

  if (err.name === "ConflictError" || err.name === "DuplicatedEmailError") {
    return res.status(httpStatus.CONFLICT).send({
      message: err.message,
    });
  }

  if (err.name === "NotFoundError") {
    return res.status(httpStatus.NOT_FOUND).send({
      message: err.message,
    });
  }

  console.error(err.name);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    error: "InternalServerError",
    message: "Internal Server Error",
  });
}
