import { prisma } from "@/config";


export function getPlayerGamesRepo(playerId: number){
    return prisma.player.findUnique({
        where: {
            id:playerId
        },
        include:{
            Game: true
        }
    })
}