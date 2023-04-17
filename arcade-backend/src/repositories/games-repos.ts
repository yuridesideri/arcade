import { prisma } from "@/config";

export function getLeaderBoardsRepo() {
	return prisma.game.findMany({
		orderBy: {
			score: "desc",
		},
		include: {
			Player: true,
		},
		take: 10,
	});
}

export function createGameRepo(
	playerId: number,
	score: number,
	gameDurationSeconds: number
) {
	return prisma.game.create({
		data: {
			score,
			gameDurationSeconds,
			Player: {
				connect: {
					id: playerId,
				},
			},
		},
	});
}
