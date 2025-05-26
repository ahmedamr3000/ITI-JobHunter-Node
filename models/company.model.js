import { model, Schema } from "mongoose";

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    industry: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    employees: {
      type: String,
      default: "Not specified",
    },
    about: {
      type: String,
      default: "",
    },
    mission: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "default_company_logo.svg",
    },
    coverImage: {
      type: String,
      default: "default_company_cover.jpg",
    },
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
    linkedin: { type: String, default: "" },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const companyModel = model("Company", companySchema);

export default companyModel;
