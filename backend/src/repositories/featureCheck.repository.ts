import Organization from "../models/Organization.js";
import FeatureFlag from "../models/FeatureFlag.js";

export const findOrganizationByCode = async (
    code: string
) => {
    return Organization.findOne({ code });
};

export const findFeature = async (
    organizationId: string,
    featureKey: string
) => {
    return FeatureFlag.findOne({
        organizationId,
        featureKey,
    });
};