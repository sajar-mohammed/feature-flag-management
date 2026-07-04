import Organization from "../models/Organization.js";

export const createOrganization = async (
    name: string,
    code: string
) => {
    return await Organization.create({
        name,
        code,
    });
};

export const getOrganizations = async () => {
    return await Organization.find().sort({
        createdAt: -1,
    });
};

export const findByCode = async (code: string) => {
    return Organization.findOne({ code });
};

export const findById = async (id: string) => {
    return Organization.findById(id);
};