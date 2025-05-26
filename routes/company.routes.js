import { Router } from "express";
import {
  deleteCompany,
  displayCompanies,
  displayCompanyByid,
  getJobsByCompany,
  register,
  UpdateCompany,
} from "../controllers/company.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const companyRoutes = Router();

companyRoutes.post("/register", authMiddleware, register);
companyRoutes.get("/display", authMiddleware, displayCompanies);
companyRoutes.get("/display/:id", displayCompanyByid);
companyRoutes.put("/update/:id", authMiddleware, UpdateCompany);
companyRoutes.delete("/delete/:id", authMiddleware, deleteCompany);
companyRoutes.get("/:id/jobs ", authMiddleware, getJobsByCompany);

export default companyRoutes;
