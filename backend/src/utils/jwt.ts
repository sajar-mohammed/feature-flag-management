import jwt from "jsonwebtoken";

interface JwtPayload {
    userId?: string;
    organizationId?: string;
    role: string;
    email?: string;
}

export const generateToken = (payload: JwtPayload) => {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "1d",
    });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET!);
};