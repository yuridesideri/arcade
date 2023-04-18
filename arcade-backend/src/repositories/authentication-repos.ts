import { prisma } from "@/config";

export function loginRepo(email: string) {
	return prisma.player.findUnique({
		where: {
			email,
		},
	});
}

export function registerRepo(credentials: {
	email: string;
	hashedPassword: string;
	username: string;
}) {
	return prisma.player.create({
		data: {
			email: credentials.email,
			username: credentials.username,
			password: credentials.hashedPassword,
		},
	});
}
