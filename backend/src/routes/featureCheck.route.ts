import { Router } from "express";
import * as controller from "../controllers/featureCheck.controller.js";

const router = Router();

router.post(
    "/",
    controller.checkFeature
);

export default router;