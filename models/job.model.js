import mongoose from "mongoose";
import { model, Schema } from "mongoose";

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    salary_range: {
      min: {
        type: Number,
        min: 0,
        required: [true, "Minimum salary is required"],
      },
      max: {
        type: Number,
        min: 0,
        required: [true, "Maximum salary is required"],
      },
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    job_status: {
      type: String,
      required: true,
      enum: ["Open", "Closed"],
      default: "Open",
    },
    job_type: {
      type: String,
      required: [true, "Job type is required"],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },
  },
  { timestamps: true }
);

const jobModel = model("Job", jobSchema);

export default jobModel;