import { Router } from "express";
import Application from "../controllers/application.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const applicationRouter = Router();

applicationRouter.post("/:jobId", authMiddleware, Application.applyJob);
applicationRouter.get("/", authMiddleware, Application.getUserApplications);
applicationRouter.get(
  "/:jobId",
  authMiddleware,
  Application.getJobApplications
);
applicationRouter.put("/:id/status", authMiddleware, Application.updateStatus);
applicationRouter.delete("/:id", authMiddleware, Application.deleteApplication);

export default applicationRouter;
