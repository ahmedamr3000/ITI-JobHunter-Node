import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import CV from "../models/resume.model.js";
import userModel from "../models/user.model.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "CVs",
    resource_type: "raw",
    format: async (req, file) => "pdf",
  },
});

export const upload = multer({ storage }).single("cv");
export const uploadresume = async (req, res) => {
  try {
    let userid = req.user.id;
    if (!userid) {
      return res.status(404).json({ status: "fail", message: "invalid id" });
    }

    let theUser = await userModel.findById(userid);

    if (!theUser) {
      return res
        .status(404)
        .json({ status: "fail", message: "user not found" });
    }

    const newCV = await CV.create({
      userId: req.user.id,
      cvUrl: req.file.path,
    });
    res.status(200).json({
      status: "success",
      message: " upload success",
      url: req.file.path,
      newCV,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export const getoneresume = async (req, res) => {
  try {
    let cvId = req.params.id;
    if (!cvId) {
      return res.status(404).json({ status: "fail", message: "invalid CV id" });
    }
    let userid = req.user.id;
    if (!userid) {
      return res.status(404).json({ status: "fail", message: "invalid id" });
    }

    let theUser = await userModel.findById(userid);

    if (!theUser) {
      return res
        .status(404)
        .json({ status: "fail", message: "user not found" });
    }

    let theCv = await CV.findById(cvId);
    if (!theCv) {
      res.status(404).json({ status: "fail", message: "CV Not Found" });
    }
    if (theUser._id != theCv.userId) {
      res
        .status(404)
        .json({ status: "fail", message: "you not have permation" });
    }

    res.status(200).json({ status: "success", data: theCv });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

export const removeresume = async (req, res) => {
  try {
    let cvId = req.params.id;
    if (!cvId) {
      return res.status(404).json({ status: "fail", message: "invalid CV id" });
    }
    let userid = req.user.id;
    if (!userid) {
      return res.status(404).json({ status: "fail", message: "invalid id" });
    }

    let theUser = await userModel.findById(userid);

    if (!theUser) {
      return res
        .status(404)
        .json({ status: "fail", message: "user not found" });
    }

    let theCv = await CV.findByIdAndDelete(cvId);

    if (theUser._id != theCv.userId) {
      res
        .status(404)
        .json({ status: "fail", message: "you not have permation" });
    }

    res.status(200).json({ status: "success", message: "deleted" });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
