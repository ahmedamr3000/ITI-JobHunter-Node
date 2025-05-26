import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const roleType = {
  jobSeeker: "job_seeker",
  employer: "employer",
  admin: "admin",
};

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "UserName field is required"],
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    confirmEmail: { type: Boolean, default: false },
    password: { type: String, required: [true, "Password is required"] },
    title: { type: String, default: "" },

    phone: {
      type: String,
      sparse: true,
      trim: true,
      default: "",
    },

    dob: { type: Date },
    idNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    gender: { type: String, enum: ["male", "female", "other", ""] },
    isVerified: { type: Boolean, default: false },

    role: {
      type: String,
      enum: Object.values(roleType),
      default: roleType.jobSeeker,
    },
    profilePicture: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/026/619/142/non_2x/default-avatar-profile-icon-of-social-media-user-photo-image-vector.jpg",
    },

    idPictureFrontPath: {
      type: String,
    },
    idPictureBackPath: {
      type: String,
    },
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    summary: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    education: [
      {
        institution: { type: String, trim: true, required: true },
        degree: { type: String, trim: true, required: true },
        fieldOfStudy: { type: String, trim: true, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, default: null },
        description: { type: String, trim: true, maxlength: 500, default: "" },
      },
    ],

    workExperience: [
      {
        title: { type: String, trim: true, required: true },
        company: { type: String, trim: true, required: true },
        location: { type: String, trim: true, default: "" },
        startDate: { type: Date, required: true },
        endDate: { type: Date, default: null },
        description: { type: String, trim: true, maxlength: 500, default: "" },
      },
    ],

    aboutMe: {
      primaryIndustry: { type: String, trim: true, default: "" },
      expectedSalary: { type: String, trim: true, default: "" },
      experience: { type: String, trim: true, default: "" },
    },

    contacts: {
      email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Please fill a valid email address",
        ],
        default: "",
      },
      phone: {
        type: String,
        trim: true,
        default: "",
      },
      location: {
        type: String,
        trim: true,
        default: "",
      },
      linkedin: {
        type: String,
        trim: true,
        default: "",
      },
    },

    objective: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    skills: [
      {
        type: String,
        trim: true,
        maxlength: 50,
      },
    ],
    cv: {
      type: String,
      default: "",
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = model("User", userSchema);
export default userModel;
