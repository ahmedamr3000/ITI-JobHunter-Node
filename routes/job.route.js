import { Router } from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  deleteAllJobs,
} from "../controllers/job.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const jobRouter = Router();

jobRouter.post("/create", authMiddleware, createJob);
jobRouter.get("/", authMiddleware, getAllJobs);
jobRouter.get("/:id", authMiddleware, getJobById);
jobRouter.put("/update/:id", authMiddleware, updateJob);
jobRouter.delete("/delete/all", authMiddleware, deleteAllJobs);
jobRouter.delete("/delete/:id", authMiddleware, deleteJob);

export default jobRouter;
