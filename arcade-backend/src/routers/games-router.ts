import {
	createGameCtrl,
	leaderBoardsCtrl,
} from "@/controllers/games-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { createGameSchema } from "@/schemas/games-schemas";
import { Router } from "express";

const gamesRouter = Router();

gamesRouter
	.get("/leaderboards", leaderBoardsCtrl)
	.post(
		"/",
		validateBody(createGameSchema),
		authenticateToken,
		createGameCtrl
	);

export { gamesRouter };
