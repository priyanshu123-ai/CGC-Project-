import { User } from "../model/UserSchema.js";
import bcrypt from "bcrypt";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import sendMail from "../utils/nodemailer.js";
import { welcomeEmail } from "../utils/welcomeEmail.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(401).json({
        success: false,
        message: "User Already exist,Please login",
      });
    }

    let profilePhoto = "";

    if (req.file) {
      const fileUri = getDataUri(req.file);

      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: "EcoSense/profile",
        resource_type: "image", // ✅ FIXED
      });

      profilePhoto = cloudResponse.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sendMail({
      from: `"EcoSense 🌱" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to EcoSense 🌍",
      html: welcomeEmail(name),
    });

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      profile: {
        profilePhoto,
      },
    });

    return res.status(201).json({
      success: true,
      message: "User created Successfully",
      user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not exist,Please register",
      });
    }

    const matchedPassword = await bcrypt.compare(password, user.password);

    if (!matchedPassword) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password,Please try again",
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profile,
      token: token,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        success: true,
        message: `Welcome back ${user.name}`,
        user: userData,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Login failed",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "Logged Out Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};