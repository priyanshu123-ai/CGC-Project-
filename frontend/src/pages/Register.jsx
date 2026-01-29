import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Lock, Mail, Upload, User, ArrowRight } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/components/context/context";
import { serverUrl } from "@/main";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;


  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    profilePhoto: null,
  });

  const [confirm, setConfirm] = useState("");
  const [preview, setPreview] = useState("");
  const [success, setSuccess] = useState(false);
  const { setUser } = useContext(AuthContext);


  /* ---------------- handlers ---------------- */

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePhoto") {
      setForm({ ...form, profilePhoto: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else if (name === "confirm") {
      setConfirm(value);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  // empty fields
  if (!form.name || !form.email || !form.password || !confirm) {
    return toast.error("All fields are required");
  }

  // name validation
  if (form.name.length < 3) {
    return toast.error("Name must be at least 3 characters");
  }

  // email validation
  if (!emailRegex.test(form.email)) {
    return toast.error("Please enter a valid email address");
  }

  // password validation
  if (!passwordRegex.test(form.password)) {
    return toast.error(
      "Password must be 8+ chars with uppercase, lowercase & number"
    );
  }

  // confirm password
  if (form.password !== confirm) {
    return toast.error("Passwords do not match");
  }

  try {
    setIsLoading(true);

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("email", form.email);
    fd.append("password", form.password);
    if (form.profilePhoto) fd.append("profilePhoto", form.profilePhoto);

    const res = await axios.post(
      `${serverUrl}/api/v1/register`,
      fd,
      { withCredentials: true }
    );

    toast.success(res.data.message);
    setSuccess(true);
    setUser(res.data.user);

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  } catch (err) {
    toast.error(err.response?.data?.message || "Registration failed");
  } finally {
    setIsLoading(false);
  }
};


  /* ---------------- UI ---------------- */

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg,#0c1210 0%,#060908 100%)",
      }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(29,185,84,0.15), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(31,168,161,0.15), transparent 70%)",
          }}
        />
      </div>

      {/* Card */}
      <Card
        className="w-full max-w-xl relative z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,25,23,0.88), rgba(8,13,11,0.88))",
          border: "1px solid rgba(37,58,52,0.6)",
          backdropFilter: "blur(20px)",
          borderRadius: "18px",
        }}
      >
        <CardHeader className="text-center">
          <div
            className="mx-auto mb-4 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#1db954,#1fa8a1,#199fe6)",
            }}
          >
            <Leaf color="#f0f5f2" />
          </div>

          <CardTitle style={{ color: "#f0f5f2", fontSize: "22px" }}>
            Create Account
          </CardTitle>

          <CardDescription style={{ color: "#9fb6ad", fontSize: "14px" }}>
            Start your journey to a greener lifestyle
          </CardDescription>

          {/* Progress bar */}
          <div className="flex justify-center gap-2 mt-4">
            <div
              className="h-1 w-16 rounded-full"
              style={{
                background: "linear-gradient(135deg,#1db954,#1fa8a1)",
              }}
            />
            <div
              className="h-1 w-16 rounded-full"
              style={{ background: "#1a231f" }}
            />
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload */}
            <div className="flex justify-center mb-8">
              <label className="relative cursor-pointer">
                <div
                  className="w-28 h-28 rounded-full flex items-center justify-center"
                  style={{
                    background: "#1a231f",
                    border: "2px dashed #2dd4bf",
                    boxShadow:
                      "0 0 0 4px rgba(45,212,191,0.25), 0 0 28px rgba(45,212,191,0.35)",
                  }}
                >
                  {preview ? (
                    <img
                      src={preview}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Upload size={28} color="#2dd4bf" />
                  )}
                  <input
                    type="file"
                    name="profilePhoto"
                    className="hidden"
                    onChange={handleChange}
                  />
                </div>
                <span
                  className="block text-center mt-3 text-sm"
                  style={{ color: "#9fb6ad" }}
                >
                  Upload photo
                </span>
              </label>
            </div>

            {/* Full Name */}
            <div>
              <label style={{ color: "#f0f5f2", fontSize: "14px" }}>
                Full Name
              </label>
              <div className="relative mt-2">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  color="#9fb6ad"
                />
                <Input
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className="pl-12"
                  style={{
                    height: "54px",
                    background: "rgba(0,0,0,0.35)",
                    border: "1.5px solid #253a34",
                    borderRadius: "14px",
                    color: "#f0f5f2",
                    fontSize: "15px",
                  }}
                  onFocus={(e) =>
                    (e.target.style.boxShadow = "0 0 0 2px rgba(29,185,84,0.7)")
                  }
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ color: "#f0f5f2", fontSize: "14px" }}>
                Email
              </label>
              <div className="relative mt-2">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  color="#9fb6ad"
                />
                <Input
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="pl-12"
                  style={{
                    height: "54px",
                    background: "rgba(0,0,0,0.35)",
                    border: "1.5px solid #253a34",
                    borderRadius: "14px",
                    color: "#f0f5f2",
                    fontSize: "15px",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ color: "#f0f5f2", fontSize: "14px" }}>
                Password
              </label>
              <div className="relative mt-2">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  color="#9fb6ad"
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="pl-12"
                  style={{
                    height: "54px",
                    background: "rgba(0,0,0,0.35)",
                    border: "1.5px solid #253a34",
                    borderRadius: "14px",
                    color: "#f0f5f2",
                    fontSize: "15px",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ color: "#f0f5f2", fontSize: "14px" }}>
                Confirm Password
              </label>
              <div className="relative mt-2">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  color="#9fb6ad"
                />
                <Input
                  type="password"
                  name="confirm"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={handleChange}
                  className="pl-12"
                  style={{
                    height: "54px",
                    background: "rgba(0,0,0,0.35)",
                    border: "1.5px solid #253a34",
                    borderRadius: "14px",
                    color: "#f0f5f2",
                    fontSize: "15px",
                  }}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 mt-2"
              style={{
                height: "54px",
                background: "linear-gradient(135deg,#1db954,#1fa8a1)",
                color: "#0c1210",
                fontSize: "16px",
                fontWeight: 600,
                borderRadius: "14px",
              }}
              disabled={isLoading || success}
            >
              {isLoading && !success && "Creating account..."}
              {success && "Account created, please wait..."}
              {!isLoading && !success && (
                <>
                  Continue <ArrowRight size={16} />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#9fb6ad" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#1db954" }}>
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
