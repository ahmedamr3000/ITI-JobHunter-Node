import { Router } from "express";
import { getoneresume, removeresume, upload, uploadresume } from "../controllers/resume.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const resumerouter = Router();

resumerouter.post("/", authMiddleware, upload, uploadresume);
resumerouter.get("/:id", authMiddleware, getoneresume);
resumerouter.delete("/:id", authMiddleware, removeresume);

export default resumerouter;
