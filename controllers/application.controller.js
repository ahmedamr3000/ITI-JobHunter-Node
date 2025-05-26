import applicationModel from "../models/application.model.js";
import jobModel from "../models/job.model.js";
import resumeModel from "../models/resume.model.js";
import userModel from "../models/user.model.js";

export default class Application {
  static async applyJob(req, res) {
    try {
      const userId = req.user.id;
      const { jobId } = req.params;
      const { resume, ExpectedSalary } = req.body;

      const job = await jobModel.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: "job does not exist" });
      }

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "user does not exist" });
      }

      if (req.user.role !== "job-seeker" && req.user.role !== "user") {
        return res
          .status(403)
          .json({ message: "user is not authorized to apply for jobs" });
      }

      const application = await applicationModel.findOne({
        job: jobId,
        applicant: userId,
      });
      if (application) {
        return res.status(403).json({ message: "application already exists" });
      }

      if (!resume) {
        return res.status(400).json({ message: "resume URL is required" });
      }

      if (isNaN(ExpectedSalary) || ExpectedSalary === null) {
        return res
          .status(400)
          .json({ message: "Expected Salary must be a valid number" });
      }

      const newApplication = await applicationModel.create({
        job: jobId,
        applicant: userId,
        resume: resume,
        ExpectedSalary: ExpectedSalary,
      });

      return res.status(201).json(newApplication);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || "internal server error" });
    }
  }

  static async getUserApplications(req, res) {
    try {
      const userId = req.user.id;

      if (!userId) {
        return res.status(401).json({ message: "token is invalid" });
      }

      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "user does not exist" });
      }

      if (req.user.role !== "job-seeker") {
        return res.status(403).json({ message: "user is not a job-seeker" });
      }

      const applications = await applicationModel.find({ applicant: userId });

      if (!applications || !applications.length) {
        return res.status(200).json({ message: "no applications were found" });
      }

      return res.status(200).json(applications);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || "internal server error" });
    }
  }

  static async getJobApplications(req, res) {
    try {
      const userId = req.user.id;

      const { jobId } = req.params;
      const job = await jobModel.findById(jobId);

      if (!job) {
        return res.status(404).json({ message: "job does not exist" });
      }

      if (!userId) {
        return res.status(401).json({ message: "token is invalid" });
      }

      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "user does not exist" });
      }

      const isEmployer =
        user.role === "employer" && user.email === job.posted_by;
      const isAdmin = req.user.role === "Admin";

      if (!isEmployer && !isAdmin) {
        return res.status(403).json({ message: "user does not have access" });
      }

      const applications = await applicationModel.find({ job: jobId });

      return res.status(200).json(applications);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || "internal server error" });
    }
  }

  static async updateStatus(req, res) {
    try {
      const userId = req.user.id;

      const { status } = req.body;

      const { id } = req.params;
      const application = await applicationModel.findById(id);

      if (!application) {
        return res.status(404).json({ message: "application does not exist" });
      }

      if (!userId) {
        return res.status(401).json({ message: "token is invalid" });
      }

      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "user does not exist" });
      }

      const job = await jobModel.findById(application.job);

      const isEmployer =
        user.role === "employer" && user.email === job.posted_by;
      const isAdmin = user.role === "Admin";

      if (!isEmployer && !isAdmin) {
        return res.status(403).json({ message: "user does not have access" });
      }

      const enumStatus = ["pending", "reviewed", "accepted", "rejected"];

      if (!status) {
        return res.status(400).json({ message: "status is required" });
      }

      if (!enumStatus.includes(status)) {
        return res.status(400).json({ message: "status provided is invalid" });
      }

      if (status === application.status) {
        return res
          .status(400)
          .json({ message: `status is already set to ${status}` });
      }

      application.status = status;
      await application.save();

      return res.status(200).json(application);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || "internal server error" });
    }
  }

  static async deleteApplication(req, res) {
    try {
      const userId = user.req.id;

      const { id } = req.params;
      const application = await applicationModel.findById(id);

      if (!application) {
        return res.status(404).json({ message: "application does not exist" });
      }

      if (!userId) {
        return res.status(401).json({ message: "token is invalid" });
      }

      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "user does not exist" });
      }

      if (user.role !== "job_seeker") {
        return res.status(403).json({ message: "user is not a job-seeker" });
      }

      if (application.applicant !== userId) {
        return res.status(403).json({ message: "user is not the applicant" });
      }

      const finalStatus = ["accepted", "rejected"];
      if (finalStatus.includes(application.status)) {
        return res.status(400).json({
          message: "application can not be deleted in the final status",
        });
      }

      await applicationModel.findByIdAndDelete(id);
      return res.status(200).json({ message: "application deleted" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || "internal server error" });
    }
  }
}
