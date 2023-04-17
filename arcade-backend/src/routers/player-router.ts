import { Router } from "express";
import { createUserSchema } from "@/schemas";
import { validateBody } from "@/middlewares";

const playerRouter = Router();

playerRouter.post("/", validateBody(createUserSchema), usersPost).get("/me", getme);

export { playerRouter };
