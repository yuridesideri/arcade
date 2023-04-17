import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import { invalidDataError, unauthorizedError } from "@/errors";
import { Player } from "@prisma/client";

type JWTPayload = Omit<Player, "password">;

export interface AuthenticatedRequest extends Request {
	userData: {
		id: number;
		createdAt: Date;
		profileImageId: string;
		email: string;
		username: string;
	};
}

export async function authenticateToken(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.header("Authorization");
	if (!authHeader) return generateUnauthorizedResponse(res);

	const token = authHeader.split(" ")[1];
	if (!token) return generateUnauthorizedResponse(res);

	try {
		try {
			const user = jwt.verify(
				token,
				process.env.JWT_SECRET
			) as JWTPayload;
			req.userData = user;
		} catch (err) {
			throw invalidDataError(["Invalid token"]);
		}

		return next();
	} catch (err) {
		return generateUnauthorizedResponse(res);
	}
}

function generateUnauthorizedResponse(res: Response) {
	res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());
}
