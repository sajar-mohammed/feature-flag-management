import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload & {
                userId?: string;
                organizationId?: string;
                role: string;
                email?: string;
            };
        }
    }
}

export { };