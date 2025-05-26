import joi from "joi";

const signUpJoiSchema = joi
  .object({
    userName: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    confirmedPassword: joi
      .string()
      .valid(joi.ref("password"))
      .required()
      .messages({
        "any.required": "Confirm Password is required",
        "any.only": "Passwords do not match",
      }),
    title: joi.string().max(100).allow("").trim().messages({
      "string.max": "Title cannot exceed {#limit} characters",
    }),
    phone: joi
      .string()
      .pattern(/^\d{10,15}$/)
      .optional(),
    dob: joi.date().iso().optional(),
    gender: joi.string().valid("male", "female", "other").optional(),
    profilePicture: joi.string().uri().optional(),
    summary: joi.string().max(1000).optional(),
    objective: joi.string().max(500).optional(),
    cv: joi.string().uri().optional(),

    aboutMe: joi
      .object({
        primaryIndustry: joi.string().optional(),
        expectedSalary: joi.string().optional(),
        experience: joi.string().optional(),
      })
      .optional(),

    contacts: joi
      .object({
        phone: joi.string().optional(),
        email: joi.string().email().optional(),
        location: joi.string().optional(),
        linkedin: joi.string().uri().optional(),
      })
      .optional(),

    skills: joi
      .alternatives()
      .try(
        joi.array().items(joi.string().max(50)),
        joi
          .string()
          .custom((value, helpers) => {
            const skillsArray = value.split(",").map((s) => s.trim());
            if (skillsArray.some((s) => s.length > 50)) {
              return helpers.error("string.max");
            }
            return skillsArray;
          }, "comma separated skills string")
          .optional()
      )
      .optional(),

    education: joi
      .array()
      .items(
        joi.object({
          institution: joi.string().optional(),
          degree: joi.string().optional(),
          fieldOfStudy: joi.string().optional(),
          startDate: joi.date().iso().optional(),
          endDate: joi.date().iso().allow(null).optional(),
          description: joi.string().max(500).optional(),
        })
      )
      .optional(),

    workExperience: joi
      .array()
      .items(
        joi.object({
          title: joi.string().optional(),
          company: joi.string().optional(),
          location: joi.string().optional(),
          startDate: joi.date().iso().optional(),
          endDate: joi.date().iso().allow(null).optional(),
          description: joi.string().max(500).optional(),
        })
      )
      .optional(),

    role: joi.string().valid("job_seeker", "employer", "admin").optional(),
  })
  .min(1);

const signInJoiSchema = joi.object({
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email":
        "Please enter a valid email address (e.g., user@example.com)",
      "any.required": "Email is required",
    }),
  password: joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
});

export { signUpJoiSchema, signInJoiSchema };
