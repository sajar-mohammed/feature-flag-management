import { Router } from "express";
import { loginAdmin, loginSuperAdmin, signupAdmin } from "../controllers/auth.controller.js";

const router = Router();

router.post("/super-admin/login", loginSuperAdmin);
router.post("/signup", signupAdmin);
router.post("/login", loginAdmin);

export default router;