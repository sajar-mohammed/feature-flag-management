import * as organizationRepository from "../repositories/organization.repository.js";

export const createOrganization = async (
    name: string,
    code: string
) => {

    const organization =
        await organizationRepository.createOrganization(
            name,
            code
        );

    return organization;
};

export const getOrganizations = async () => {
    return organizationRepository.getOrganizations();
};