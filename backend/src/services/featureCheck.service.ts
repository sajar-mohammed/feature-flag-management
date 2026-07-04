import * as repository from "../repositories/featureCheck.repository.js";

export const checkFeature = async (
    organizationCode: string,
    featureKey: string
) => {

    const organization =
        await repository.findOrganizationByCode(
            organizationCode
        );

    // Unknown org → feature cannot be enabled
    if (!organization) {
        return { enabled: false };
    }

    const feature =
        await repository.findFeature(
            organization._id.toString(),
            featureKey
        );

    // Unknown feature key → treat as not enabled
    return {
        enabled: feature?.enabled ?? false
    };

};