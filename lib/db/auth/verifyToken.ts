import jwt from "jsonwebtoken";

export function verifyToken(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    throw new Error("No token");
  }

  const token = authHeader.split(" ")[1]; // Bearer TOKEN

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as { id: string; role: "ADMIN" | "AGENT" };

  return decoded;
}
