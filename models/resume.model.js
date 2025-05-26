import { Schema, model } from "mongoose";

const cvSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cvUrl: {
    type: String,
    required: true,
  },
});

export default model("CV", cvSchema);
