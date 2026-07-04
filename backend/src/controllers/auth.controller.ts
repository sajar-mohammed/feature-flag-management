import type { Request, Response } from "express";
import { superAdminLogin, adminSignup, adminLogin } from "../services/auth.service.js";
import { asyncHandler } from "../middleware/asyncHandler.middleware.js";

export const loginSuperAdmin = asyncHandler(
    (req: Request, res: Response) => {
        const { email, password } = req.body;

        const token = superAdminLogin(email, password);

        return res.json({
            success: true,
            token,
        });
    }
);

export const signupAdmin = asyncHandler(
    async (req: Request, res: Response) => {
        const { name, email, password, organizationCode } = req.body;

        const user = await adminSignup(name, email, password, organizationCode);

        return res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
);

export const loginAdmin = asyncHandler(
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const { user, token, organizationName, organizationCode } =
            await adminLogin(email, password);

        return res.json({
            success: true,
            message: "Login successful",
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                organizationName,
                organizationCode,
            },
        });
    }
);
