import { Router } from "express";

const gamesRouter = Router();

gamesRouter.post("/sign-in", validateBody(signInSchema), singInPost);

export { gamesRouter };
