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