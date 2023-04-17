import { AuthenticatedRequest } from "@/middlewares";
import { createGameRepo, getLeaderBoardsRepo } from "@/repositories/games-repos";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function leaderBoardsCtrl(
	req: Request,
	res: Response
): Promise<Response> {
	try {
		const leaderboards = await getLeaderBoardsRepo();
		return res.status(httpStatus.OK).send(leaderboards);
	} catch (err) {
		console.error(err);
		res.status(err.status || httpStatus.BAD_REQUEST);
		return res.send(err);
	}
}

export async function createGameCtrl(
	req: AuthenticatedRequest,
	res: Response
): Promise<Response> {
	try {
		const { id: userId } = req.userData;
		const { score, gameDurationSeconds } = req.body;
		const game = await createGameRepo(userId, score, gameDurationSeconds);
	} catch (err) {
		console.error(err);
		res.status(err.status || httpStatus.BAD_REQUEST);
		return res.send(err);
	}
}
