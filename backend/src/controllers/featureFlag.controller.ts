import type { Request, Response } from "express";
import * as featureFlagService from "../services/featureFlag.service.js";

export const createFeatureFlag = async (
    req: Request,
    res: Response
) => {
    try {
        const { featureKey, enabled } = req.body;

        const feature =
            await featureFlagService.createFeatureFlag(
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
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: (error as Error).message,
        });
    }
};

export const getFeatureFlags = async (
    req: Request,
    res: Response
) => {
    try {
        const features =
            await featureFlagService.getFeatureFlags(
                req.user!.organizationId!
            );

        return res.json({
            success: true,
            data: features,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: (error as Error).message,
        });
    }
};

export const updateFeatureStatus = async (
    req: Request,
    res: Response
) => {
    try {
        const { enabled } = req.body;

        const feature =
            await featureFlagService.updateFeatureStatus(
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
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: (error as Error).message,
        });
    }
};