import FeatureFlag from "../models/FeatureFlag.js";

interface CreateFeatureFlagParams {
    featureKey: string;
    enabled: boolean;
    organizationId: string;
    createdBy: string;
}

export const findByKey = async (
    featureKey: string,
    organizationId: string
) => {
    return FeatureFlag.findOne({
        featureKey,
        organizationId,
    });
};

export const createFeatureFlag = async (
    data: CreateFeatureFlagParams
) => {
    return FeatureFlag.create(data);
};

export const getFeatureFlags = async (
    organizationId: string
) => {
    return FeatureFlag.find({
        organizationId,
    }).sort({
        createdAt: -1,
    });
};

export const findByIdAndOrganization = async (
    id: string,
    organizationId: string
) => {
    return FeatureFlag.findOne({
        _id: id,
        organizationId,
    });
};

export const updateFeatureStatus = async (
    id: string,
    organizationId: string,
    enabled: boolean
) => {
    return FeatureFlag.findOneAndUpdate(
        {
            _id: id,
            organizationId,
        },
        {
            enabled,
        },
        {
            new: true,
        }
    );
};