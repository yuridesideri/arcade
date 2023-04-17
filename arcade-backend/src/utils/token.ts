import { Player } from "@prisma/client";
import jwt from "jsonwebtoken";

export async function generateToken(user: Omit<Player, 'password'>) {
	const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '1d'});

	return token;
}