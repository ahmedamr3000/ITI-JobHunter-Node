import userModel from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to see all users",
      });
    }

    const users = await userModel.find({}, { password: 0 });
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: err.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id) {
      const user = await userModel.findById(id, { password: 0 });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      res.status(200).json({ success: true, user });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching user by ID",
      error: err.message,
    });
  }
};

export const searchUser = async (req, res) => {
  try {
    const { userName, email } = req.body;

    if (!userName && !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide a user name or email to search",
      });
    }

    const query = {};

    if (email) {
      query.email = { $regex: email, $options: "i" };
    }

    if (userName) {
      query.userName = { $regex: userName, $options: "i" };
    }

    const users = await userModel.find(query, { password: 0 });

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error searching users",
      error: err.message,
    });
  }
};

const rounds = 10;

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this user",
      });
    }

    if (req.user.role !== "admin" && req.body.role) {
      return res.status(403).json({
        success: false,
        message: "You cannot change your role",
      });
    }

    const updateData = {};

    [
      "userName",
      "password",
      "dob",
      "gender",
      "profilePicture",
      "summary",
      "objective",
      "cv",
      "title",
    ].forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (req.body.aboutMe) {
      updateData.aboutMe = {};
      if (req.body.aboutMe.primaryIndustry !== undefined)
        updateData.aboutMe.primaryIndustry = req.body.aboutMe.primaryIndustry;
      if (req.body.aboutMe.expectedSalary !== undefined)
        updateData.aboutMe.expectedSalary = req.body.aboutMe.expectedSalary;
      if (req.body.aboutMe.experience !== undefined)
        updateData.aboutMe.experience = req.body.aboutMe.experience;
    }

    if (req.body.contacts) {
      updateData.contacts = { ...req.body.contacts };
    }

    if (req.body.skills !== undefined) {
      if (typeof req.body.skills === "string") {
        updateData.skills = req.body.skills.split(",").map((s) => s.trim());
      } else if (Array.isArray(req.body.skills)) {
        updateData.skills = req.body.skills.map((s) => String(s).trim());
      }
    }

    if (req.body.education !== undefined && Array.isArray(req.body.education)) {
      updateData.education = req.body.education;
    }

    if (
      req.body.workExperience !== undefined &&
      Array.isArray(req.body.workExperience)
    ) {
      updateData.workExperience = req.body.workExperience;
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(
        updateData.password,
        HASH_SALT_ROUNDS
      );
    }

    const updatedUser = await userModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { password, ...userWithoutPassword } = updatedUser.toObject();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("🔥 Error in updateUser (Backend Catch):", err.message);
    console.error("🔥 Full error object:", err);
    return res.status(500).json({
      success: false,
      message: "Error updating user",
      error: err.message,
    });
  }
};

export const deleteAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete all users",
      });
    }

    const result = await userModel.deleteMany({ role: { $ne: "admin" } });
    return res.status(200).json({
      success: true,
      message: "All non-admin users deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error deleting all users",
      error: err.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this user",
      });
    }

    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: err.message,
    });
  }
};
