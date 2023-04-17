import { Router } from "express";

const gamesRouter = Router();

gamesRouter.get("/leaderboards", leaderBoardsCtrl).post("/", createGameCtrl);

export { gamesRouter };
