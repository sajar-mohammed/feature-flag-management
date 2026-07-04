import User from "../models/User.js";

interface CreateUserParams {
    name: string;
    email: string;
    password: string;
    organizationId: string;
    role: "ORG_ADMIN";
}

export const findByEmail = async (email: string) => {
    return User.findOne({ email });
};

export const createUser = async (data: CreateUserParams) => {
    return User.create(data);
};