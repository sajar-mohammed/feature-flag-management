import { Router } from "express";
import * as organizationController from "../controllers/organization.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.post(
    "/",
    authenticate,
    authorize(ROLES.SUPER_ADMIN),
    organizationController.createOrganization
);

router.get(
    "/",
    authenticate,
    authorize(ROLES.SUPER_ADMIN),
    organizationController.getOrganizations
);

export default router;