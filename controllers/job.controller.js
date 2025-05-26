import jobModel from "../models/job.model.js";
import companyModel from "../models/company.model.js";

export const createJob = async (req, res) => {
  const { id, role } = req.user;

  if (role !== "employer") {
    return res.json({ message: "You are not allowed to create Job" });
  }

  try {
    const { title, description, salary_range, location, job_type } = req.body;

    const company = await companyModel.findOne({ createdBy: id });
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "user doesn't have a company",
      });
    }

    if (!title || !description || !salary_range || !location) {
      return res.status(400).json({
        message:
          "Please provide Title, Description, Salary Range, and Location",
      });
    }
    if (salary_range.min === undefined || salary_range.max === undefined) {
      return res
        .status(400)
        .json({ message: "Salary range must include both min and max values" });
    }

    if (typeof title !== "string") {
      return res.status(400).json({ message: "Title must be a string" });
    }
    if (typeof description !== "string") {
      return res.status(400).json({ message: "Description must be a string" });
    }
    if (typeof location !== "string") {
      return res.status(400).json({ message: "Location must be a string" });
    }
    if (
      typeof salary_range.min !== "number" ||
      typeof salary_range.max !== "number"
    ) {
      return res
        .status(400)
        .json({ message: "Salary range values must be numbers" });
    }

    if (salary_range.min < 0 || salary_range.max < 0) {
      return res
        .status(400)
        .json({ message: "Salary range values cannot be negative" });
    }
    if (salary_range.min > salary_range.max) {
      return res
        .status(400)
        .json({ message: "Minimum salary must be less than maximum salary" });
    }

    const newJob = new jobModel({
      title,
      description,
      salary_range,
      location,
      job_type,
      company: company._id,
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Sorry! Job is not created", error: error.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await jobModel.find().populate("company");
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({
      message: "There are no Jobs at this time",
      error: error.message,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await jobModel.findById(req.params.id).populate("company");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    res
      .status(500)
      .json({ message: "There is no job with this id", error: error.message });
  }
};

export const updateJob = async (req, res) => {
  const { id, role } = req.user;

  if (role !== "employer") {
    return res.json({ message: "You are not allowed to update Job" });
  }

  try {
    const job = await jobModel.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const company = await companyModel.findById(job.company);

    if (id !== company.createdBy.toString()) {
      return res.json({
        message: "you cannot update a job you did not create",
      });
    }

    const { title, description, salary_range, location, job_type } = req.body;

    const updatedData = {};
    if (title) {
      if (typeof title !== "string") {
        return res.status(400).json({ message: "Title must be a string" });
      }
      updatedData.title = title;
    }
    if (description) {
      if (typeof description !== "string") {
        return res
          .status(400)
          .json({ message: "Description must be a string" });
      }
      updatedData.description = description;
    }
    if (location) {
      if (typeof location !== "string") {
        return res.status(400).json({ message: "Location must be a string" });
      }
      updatedData.location = location;
    }
    if (job_type) {
      if (typeof job_type !== "string") {
        return res.status(400).json({ message: "Job type must be a string" });
      }
      updatedData.job_type = job_type;
    }
    if (salary_range) {
      if (salary_range.min === undefined || salary_range.max === undefined) {
        return res.status(400).json({
          message: "Salary range must include both min and max values",
        });
      }
      if (
        typeof salary_range.min !== "number" ||
        typeof salary_range.max !== "number"
      ) {
        return res
          .status(400)
          .json({ message: "Salary range values must be numbers" });
      }
      if (salary_range.min < 0 || salary_range.max < 0) {
        return res
          .status(400)
          .json({ message: "Salary range values cannot be negative" });
      }
      if (salary_range.min > salary_range.max) {
        return res
          .status(400)
          .json({ message: "Minimum salary must be less than maximum salary" });
      }
      updatedData.salary_range = salary_range;
    }

    const updatedJob = await jobModel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating the job",
      error: error.message,
    });
  }
};

export const deleteJob = async (req, res) => {
  const { id, role } = req.user;

  if (role !== "employer") {
    return res.json({ message: "You are not allowed to delete Job" });
  }

  try {
    const job = await jobModel.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const company = await companyModel.findById(job.company);

    if (id !== company.createdBy.toString()) {
      return res.json({
        message: "you cannot delete a job you did not create",
      });
    }

    await jobModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Job does not exist!", error: error.message });
  }
};

export const deleteAllJobs = async (req, res) => {
  const { role } = req.user;

  if (role !== "admin") {
    return res.json({ message: "You are not allowed to delete Jobs" });
  }

  try {
    const result = await jobModel.deleteMany({});

    if (result.deletedCount > 0) {
      res.status(200).json({
        message: "All jobs deleted successfully",
        deletedCount: result.deletedCount,
      });
    } else {
      res.status(404).json({
        message: "No jobs found in the database to delete",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "error while deleting all jobs",
      error: error.message,
    });
  }
};
