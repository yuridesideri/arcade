import { invalidDataError, invalidEmailError, unauthorizedError } from "@/errors";
import { loginRepo, registerRepo } from "@/repositories/authentication-repos";
import { Request, Response } from "express";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { generateToken } from "@/utils/token";
import { exclude } from "@/utils/prisma-utils";

export async function loginCtrl(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const result = await loginRepo(email);

    if (!result) throw invalidEmailError(email);

    if (!bcrypt.compareSync(password, result.password)) throw unauthorizedError();

    const userData = exclude(result, "password");

    const token = generateToken(userData);

    return res.status(httpStatus.OK).send({token});
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}

export async function registerCtrl(req: Request, res: Response) {
  const { email, username, password } = req.body;

  try {
    const userAlreadyExists = await loginRepo(email);
    if (userAlreadyExists) throw invalidDataError(["Username or email already taken"]);

    const hashedPassword = bcrypt.hashSync(password, 10);

    const userDataRaw = await registerRepo({ email, username, hashedPassword });

    const userData = exclude(userDataRaw, "password");

    const token = generateToken(userData);

    return res.status(httpStatus.OK).send({token});
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}