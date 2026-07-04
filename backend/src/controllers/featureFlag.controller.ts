import type { Request, Response } from "express";
import * as featureFlagService from "../services/featureFlag.service.js";
import { asyncHandler } from "../middleware/asyncHandler.middleware.js";

export const createFeatureFlag = asyncHandler(
    async (req: Request, res: Response) => {
        const { featureKey, enabled } = req.body;

        const feature = await featureFlagService.createFeatureFlag(
            featureKey,
            enabled,
            req.user!.organizationId!,
            req.user!.userId!
        );

        return res.status(201).json({
            success: true,
            message: "Feature flag created successfully",
            data: feature,
        });
    }
);

export const getFeatureFlags = asyncHandler(
    async (req: Request, res: Response) => {
        const features = await featureFlagService.getFeatureFlags(
            req.user!.organizationId!
        );

        return res.json({
            success: true,
            data: features,
        });
    }
);

export const updateFeatureStatus = asyncHandler(
    async (req: Request, res: Response) => {
        const { enabled } = req.body;

        const feature = await featureFlagService.updateFeatureStatus(
            req.params.id as string,
            req.user!.organizationId!,
            enabled
        );

        return res.json({
            success: true,
            message: enabled
                ? "Feature enabled successfully"
                : "Feature disabled successfully",
            data: feature,
        });
    }
);