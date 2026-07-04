import * as repository from "../repositories/featureCheck.repository.js";

export const checkFeature = async (
    organizationCode: string,
    featureKey: string
) => {

    const organization =
        await repository.findOrganizationByCode(
            organizationCode
        );

    if (!organization) {
        throw new Error("Organization not found");
    }

    const feature =
        await repository.findFeature(
            organization._id.toString(),
            featureKey
        );

    return {
        enabled: feature?.enabled ?? false
    };

};