import { singInPost } from "@/controllers";
import { validateBody } from "@/middlewares";
import { signInSchema } from "@/schemas";
import { Router } from "express";

const authenticationRouter = Router();

authenticationRouter.post("/login", validateBody(signInSchema), loginCtrl).post("/register", validateBody(registerSchema), singInPost, registerCtrl);

export { authenticationRouter };
