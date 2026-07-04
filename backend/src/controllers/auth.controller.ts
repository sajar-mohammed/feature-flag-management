import type { Request, Response } from "express";
import { superAdminLogin, adminSignup, adminLogin } from "../services/auth.service.js";

export const loginSuperAdmin = (
    req: Request,
    res: Response
) => {
    try {
        const { email, password } = req.body;

        const token = superAdminLogin(email, password);

        return res.json({
            success: true,
            token,
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: (error as Error).message,
        });
    }
}

export const signupAdmin = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            name,
            email,
            password,
            organizationCode,
        } = req.body;

        const user = await adminSignup(
            name,
            email,
            password,
            organizationCode
        );

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
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: (error as Error).message,
        });
    }
};

export const loginAdmin = async (
    req: Request,
    res: Response
) => {

    try {

        const { email, password } = req.body;

        const { user, token } =
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
            },
        });

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: (error as Error).message,
        });

    }

};
