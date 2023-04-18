import { authenticationRouter } from "./authentication-router";
import { gamesRouter } from "./games-router";
import { playerRouter } from "./player-router";
import { Router } from "express";

const mainRouter = Router();

mainRouter.use("/auth", authenticationRouter).use("/players", playerRouter).use("/games", gamesRouter);

export { mainRouter };
