import { AuthenticatedRequest } from "@/middlewares";
import { getPlayerGamesRepo } from "@/repositories/player-repos";
import { Response } from "express";
import httpStatus from "http-status";

export async function getPlayerGamesCtrl(
	req: AuthenticatedRequest,
	res: Response
): Promise<Response> {
	try {
		const { id } = req.userData;
        const playerAndGames = await getPlayerGamesRepo(id);
        return res.send({playerAndGames, games: playerAndGames.Game});
	} catch (err) {
		console.error(err);
		res.status(err.status || httpStatus.BAD_REQUEST);
		return res.send(err);
	}
}
