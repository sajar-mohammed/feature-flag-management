
import type { Request, Response, NextFunction } from "express";

export const authorize =
    (...roles: string[]) =>
        (req: Request, res: Response, next: NextFunction) => {
            if (!req.user || !roles.includes(req.user.role)) {
                return res.status(403).json({
                    message: "Forbidden",
                });
            }

            next();
        };