import type { Request, Response } from "express";
import * as service from "../services/featureCheck.service.js";
import { asyncHandler } from "../middleware/asyncHandler.middleware.js";

export const checkFeature = asyncHandler(
    async (req: Request, res: Response) => {
        const { organizationCode, featureKey } = req.body;

        const response = await service.checkFeature(organizationCode, featureKey);

        return res.json({
            success: true,
            ...response
        });
    }
);