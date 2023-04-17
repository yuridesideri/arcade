import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getPlayerGamesCtrl } from "@/controllers/player-controller";

const playerRouter = Router();

playerRouter.use(authenticateToken).get("/me", getPlayerGamesCtrl);

export { playerRouter };
