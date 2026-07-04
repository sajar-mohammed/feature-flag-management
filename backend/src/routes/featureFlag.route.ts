import { Router } from "express";
import * as featureFlagController from "../controllers/featureFlag.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.use(authenticate);
router.use(authorize(ROLES.ORG_ADMIN));

router.post(
    "/",
    featureFlagController.createFeatureFlag
);

router.get(
    "/",
    featureFlagController.getFeatureFlags
);

router.patch(
    "/:id",
    featureFlagController.updateFeatureStatus
);

export default router;