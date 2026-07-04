import type { Request, Response } from "express";
import * as service from "../services/featureCheck.service.js";

export const checkFeature = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            organizationCode,
            featureKey
        } = req.body;

        const response =
            await service.checkFeature(
                organizationCode,
                featureKey
            );

        return res.json({
            success: true,
            ...response
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: (error as Error).message
        });

    }

};