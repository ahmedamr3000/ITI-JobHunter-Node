import { model, Schema } from "mongoose";

const applicationSchema = new Schema(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending",
    },
    ExpectedSalary: {
      type: Number,
      required: true,
    },
  },

  { timestamps: true }
);

const applicationModel = model("Application", applicationSchema);

export default applicationModel;
