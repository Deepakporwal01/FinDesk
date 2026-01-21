import jwt from "jsonwebtoken";

export type UserRole = "ADMIN" | "AGENT" | "USER";

export interface DecodedToken {
  id: string;
  role: UserRole;
}

export function verifyToken(req: Request): DecodedToken {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    throw new Error("Invalid token format");
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as DecodedToken;

  return decoded;
}
