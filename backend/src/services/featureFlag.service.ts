import * as featureFlagRepository from "../repositories/featureFlag.repository.js";

export const createFeatureFlag = async (
    featureKey: string,
    enabled: boolean,
    organizationId: string,
    createdBy: string
) => {
    const existing = await featureFlagRepository.findByKey(
        featureKey,
        organizationId
    );

    if (existing) {
        throw new Error("Feature already exists");
    }

    return featureFlagRepository.createFeatureFlag({
        featureKey,
        enabled,
        organizationId,
        createdBy,
    });
};

export const getFeatureFlags = async (
    organizationId: string
) => {
    return featureFlagRepository.getFeatureFlags(
        organizationId
    );
};

export const updateFeatureStatus = async (
    id: string,
    organizationId: string,
    enabled: boolean
) => {
    const feature =
        await featureFlagRepository.findByIdAndOrganization(
            id,
            organizationId
        );

    if (!feature) {
        throw new Error("Feature not found");
    }

    return featureFlagRepository.updateFeatureStatus(
        id,
        organizationId,
        enabled
    );
};