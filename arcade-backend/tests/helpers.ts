import * as jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/config";

export async function cleanDb() {
	const tablenames: { tablename: string }[] =
		await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

	const tables = tablenames
		.map(({ tablename }) => tablename)
		.filter((name) => name !== "_prisma_migrations")
		.map((name) => `"public"."${name}"`)
		.join(", ");

	try {
		await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
	} catch (error) {
		console.log({ error });
	}
}

export async function generateValidToken(user?: User) {
	const incomingUser = user || (await createUser());
	const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

	await createSession(token);

	return token;
}
