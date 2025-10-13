import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET as string;

// `expiresIn` should match SignOptions["expiresIn"]
export const generateToken = (
  payload: object,
  expiresIn: SignOptions["expiresIn"] = "7d"
): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as string | JwtPayload;
};
