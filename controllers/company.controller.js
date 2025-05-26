import companyModel from "../models/company.model.js";
import jobModel from "../models/job.model.js";
import userModel from "../models/user.model.js";

export const register = async (req, res) => {
  const { role, id: userId } = req.user;

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "user does not exist" });
  }

  if (role !== "employer") {
    return res
      .status(403)
      .json({ message: "you are not allowed to create company" });
  }

  const { name, industry, website } = req.body;

  if (!name || !industry || !website) {
    return res.status(400).json({ message: "please complete all fields" });
  }

  try {
    const company = await companyModel.create({
      name,
      industry,
      website,
      createdBy: userId,
    });

    res.status(201).json({ message: "company is created", company });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const displayCompanies = async (req, res) => {
  try {
    const foundedCompany = await companyModel.find({});

    res.status(200).json({ foundedCompany });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const displayCompanyByid = async (req, res) => {
  try {
    const { id: companyId } = req.params;

    const FoundedCompany = await companyModel.findById(companyId);

    if (!FoundedCompany) {
      return res.status(404).json({ message: "Company Not Found" });
    }

    const companyJobs = await jobModel.find({ company: companyId });

    return res.status(200).json({
      message: "Company found",
      company: FoundedCompany,
      jobs: companyJobs,
    });
  } catch (error) {
    console.error("Error fetching company details:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
};

export const UpdateCompany = async (req, res) => {
  const userId = req.user.id;
  const { id: companyId } = req.params;

  try {
    const companyToUpdate = await companyModel.findById(companyId);

    if (!companyToUpdate) {
      return res.status(404).json({ message: "Company not found." });
    }

    if (companyToUpdate.createdBy.toString() !== userId) {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          message:
            "You are not the owner of this company, and you don't have admin privileges to update it.",
        });
      }
    }

    const { name, industry, website } = req.body;

    if (!name || !industry || !website) {
      return res.status(400).json({
        message:
          "Please provide all required fields (name, industry, website).",
      });
    }

    const updatedCompany = await companyModel.findByIdAndUpdate(
      companyId,
      { name, industry, website },
      { new: true }
    );

    return res.status(200).json({
      message: "Company updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
};

export const deleteCompany = async (req, res) => {
  const userId = req.user.id;

  let owner = await companyModel.findOne({ createdBy: userId });

  if (!owner) {
    return res.status(403).json({ message: "you are not the owner to delete" });
  }
  ``;

  if (!(req.user.role === "employer" || req.user.role === "admin")) {
    return res.status(403).json({ message: "you are not allowed to delete" });
  }

  try {
    const { id: companyId } = req.params;

    const deletedCompany = await companyModel.deleteOne({ _id: companyId });

    res.status(200).json({ message: deletedCompany });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getJobsByCompany = async (req, res) => {
  try {
    const { id: companyId } = req.params;

    const Companyjobs = await jobModel.find({ company: companyId });

    res.status(200).json({ message: Companyjobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
