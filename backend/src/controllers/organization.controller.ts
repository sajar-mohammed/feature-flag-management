import type { Request, Response } from "express";
import * as organizationService from "../services/organization.service.js";
import { asyncHandler } from "../middleware/asyncHandler.middleware.js";

export const createOrganization = asyncHandler(
    async (req: Request, res: Response) => {
        const { name, code } = req.body;

        const organization = await organizationService.createOrganization(
            name,
            code
        );

        res.status(201).json({
            success: true,
            data: organization,
        });
    }
);

export const getOrganizations = asyncHandler(
    async (req: Request, res: Response) => {
        const organizations = await organizationService.getOrganizations();

        res.json({
            success: true,
            data: organizations,
        });
    }
);