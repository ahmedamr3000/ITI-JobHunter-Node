import { Router } from "express";
import * as authRoutesService from "../controllers/auth.controller.js";
import { validation } from "../middleware/joi.middleware.js";
import { signInJoiSchema, signUpJoiSchema } from "../config/joi.validation.js";

const authRoutes = Router();

authRoutes.post(
  "/signUp",
  validation(signUpJoiSchema),
  authRoutesService.register
);
authRoutes.post("/login", validation(signInJoiSchema), authRoutesService.login);
authRoutes.get("/verify/:token", authRoutesService.verifyEmail);

export default authRoutes;
