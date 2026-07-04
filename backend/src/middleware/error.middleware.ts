import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || (err.message?.toLowerCase().includes("unauthorized") || err.message?.toLowerCase().includes("invalid credential") ? 401 : 400);

    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};
