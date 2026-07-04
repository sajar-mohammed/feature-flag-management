import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import { ROLES } from "../constants/roles.js";

import * as organizationRepository from "../repositories/organization.repository.js";
import * as userRepository from "../repositories/user.repository.js";

export const superAdminLogin = (
    email: string,
    password: string
) => {
    if (
        email !== process.env.SUPER_ADMIN_EMAIL ||
        password !== process.env.SUPER_ADMIN_PASSWORD
    ) {
        throw new Error("Invalid Credentials");
    }

    return generateToken({
        email,
        role: ROLES.SUPER_ADMIN,
    });
};

export const adminSignup = async (
    name: string,
    email: string,
    password: string,
    organizationCode: string
) => {
    // Find organization
    const organization = await organizationRepository.findByCode(
        organizationCode
    );

    if (!organization) {
        throw new Error("Organization not found");
    }

    // Check existing user
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
        throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    return userRepository.createUser({
        name,
        email,
        password: hashedPassword,
        organizationId: organization._id.toString(),
        role: ROLES.ORG_ADMIN,
    });
};

export const adminLogin = async (
    email: string,
    password: string
) => {

    const user = await userRepository.findByEmail(email);

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken({
        userId: user._id.toString(),
        organizationId: user.organizationId.toString(),
        role: user.role,
        email: user.email,
    });

    return {
        user,
        token,
    };
};