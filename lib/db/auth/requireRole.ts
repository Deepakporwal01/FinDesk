import { NextResponse } from "next/server";
import { verifyToken } from "./verifyToken";

export function requireRole(
  req: Request,
  allowedRoles: ("ADMIN" | "AGENT")[]
) {
  try {
    const user = verifyToken(req);

    if (!allowedRoles.includes(user.role)) {
      return {
        error: NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        ),
      };
    }

    return { user };
  } catch {
    return {
      error: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }
}
