import { loginCtrl, registerCtrl } from "@/controllers";
import { validateBody } from "@/middlewares";
import { registerSchema, signInSchema } from "@/schemas";
import { Router } from "express";

const authenticationRouter = Router();

authenticationRouter
	.post("/login", validateBody(signInSchema), loginCtrl)
	.post("/register", validateBody(registerSchema), registerCtrl);

export { authenticationRouter };
