import userModel from "../models/user.model.js";
import * as bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

const rounds = parseInt(process.env.SALT_ROUND);

const register = async (req, res) => {
  try {
    const { userName, email, password, confirmedPassword, role } = req.body;

    if (password !== confirmedPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    if (await userModel.findOne({ email })) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    if (role === "admin") {
      return res
        .status(403)
        .json({ success: false, message: "You cannot register as an admin." });
    }

    const user = await userModel.create({
      userName,
      email,
      password,
      role,
    });

    const objectUser = user.toObject();
    delete objectUser.password;

    const token = jwt.sign({ id: user._id }, process.env.CONFIRM_EMAIL_TOKEN);
    const url = `${req.protocol}://${req.hostname}:${process.env.PORT}/api/auth/verify/${token}`;
    sendEmail(objectUser.email, url);

    res.status(200).json({
      message: "User registered successfully",
      objectUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send("Email does not exists. You must register first.");
    }

    const match = await user.comparePassword(password);

    if (!match) {
      return res.status(400).send("Invalid Password");
    }

    const objectUser = user.toObject();
    delete objectUser.password;

    const token = jwt.sign(
      { id: user._id, isLoggedIn: true, role: user.role },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "10h" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).send("Token is required");
    }

    const decoded = jwt.verify(token, process.env.CONFIRM_EMAIL_TOKEN);

    const user = await userModel.findOneAndUpdate(
      { _id: decoded.id },
      { confirmEmail: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verified</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  text-align: center;
                  padding: 50px;
                  background-color: #f4f4f4;
              }
              .container {
                  background: white;
                  padding: 30px;
                  border-radius: 10px;
                  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                  display: inline-block;
              }
              h1 {
                  color: #4CAF50;
              }
              p {
                  font-size: 18px;
              }
          
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Email Verified ✅</h1>
              <p>Your email has been successfully verified. 
          </div>
      </body>
      </html>
    `);
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).send("Token is not valid");
    }
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export { register, login, verifyEmail };
