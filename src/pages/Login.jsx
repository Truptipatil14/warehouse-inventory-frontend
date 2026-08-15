import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaWarehouse,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaShieldAlt,
  FaBoxes,
} from "react-icons/fa";

import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(formData);

      if (data.success) {
        localStorage.setItem("token", data.token);

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        toast.success("Login successful!");

        navigate("/dashboard");
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      console.log("RESPONSE:", error.response?.data);

      toast.error(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center px-4 py-10">

      {/* Background Glow */}

      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>

      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl"></div>

      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>


      {/* Main Container */}

      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 backdrop-blur-2xl shadow-2xl shadow-black/40">


        {/* ================= LEFT SIDE ================= */}

        <div className="hidden lg:flex relative flex-col justify-between p-12 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 text-white overflow-hidden">

          {/* Decorative circles */}

          <div className="absolute -top-20 -right-20 w-64 h-64 border border-white/10 rounded-full"></div>

          <div className="absolute -bottom-24 -left-24 w-72 h-72 border border-white/10 rounded-full"></div>


          {/* Logo */}

          <div className="relative">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-lg">

                <FaWarehouse />

              </div>

              <div>

                <h1 className="text-xl font-bold">
                  WarehousePro
                </h1>

                <p className="text-blue-100 text-xs">
                  Inventory Management
                </p>

              </div>

            </div>

          </div>


          {/* Main Text */}

          <div className="relative">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm mb-6">

              <FaShieldAlt />

              Secure Inventory System

            </div>

            <h2 className="text-4xl xl:text-5xl font-extrabold leading-tight">

              Manage your
              <br />

              <span className="text-cyan-200">
                warehouse
              </span>

              <br />

              smarter.

            </h2>

            <p className="mt-6 text-blue-100 leading-relaxed max-w-md">

              Track products, suppliers, stock movements
              and inventory reports from one powerful
              dashboard.

            </p>


            {/* Feature Cards */}

            <div className="grid grid-cols-2 gap-3 mt-8">

              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4">

                <FaBoxes className="text-cyan-200 text-xl mb-2" />

                <p className="font-semibold">
                  Inventory
                </p>

                <p className="text-xs text-blue-100 mt-1">
                  Real-time stock
                </p>

              </div>


              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4">

                <FaShieldAlt className="text-cyan-200 text-xl mb-2" />

                <p className="font-semibold">
                  Secure
                </p>

                <p className="text-xs text-blue-100 mt-1">
                  Protected access
                </p>

              </div>

            </div>

          </div>


          {/* Footer */}

          <p className="relative text-xs text-blue-100">
            © 2026 WarehousePro · All rights reserved
          </p>

        </div>


        {/* ================= RIGHT SIDE ================= */}

        <div className="bg-white/95 backdrop-blur-xl p-7 sm:p-10 lg:p-12">

          {/* Mobile Logo */}

          <div className="lg:hidden flex justify-center mb-8">

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center text-2xl shadow-xl shadow-blue-500/30">

              <FaWarehouse />

            </div>

          </div>


          {/* Heading */}

          <div className="mb-8">

            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">
              Welcome Back
            </p>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">

              Sign in to your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                {" "}account
              </span>

            </h2>

            <p className="text-slate-500 mt-3">
              Enter your credentials to access your
              warehouse dashboard.
            </p>

          </div>


          {/* Login Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Email */}

            <div>

              <label className="block text-sm font-bold text-slate-700 mb-2">
                Email Address
              </label>

              <div className="relative">

                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="trupti@example.com"
                  autoComplete="email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-slate-800 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400"
                />

              </div>

            </div>


            {/* Password */}

            <div>

              <div className="flex items-center justify-between mb-2">

                <label className="block text-sm font-bold text-slate-700">
                  Password
                </label>

                <span className="text-xs text-blue-600 font-semibold">
                  Secure Login
                </span>

              </div>

              <div className="relative">

                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-12 py-4 text-slate-800 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition"
                >

                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}

                </button>

              </div>

            </div>


            {/* Remember / Security */}

            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 text-slate-500 cursor-pointer">

                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600"
                />

                Remember me

              </label>

              <span className="text-blue-600 font-semibold">
                Protected Access
              </span>

            </div>


            {/* Login Button */}

            <button
  type="submit"
  disabled={loading}
  className="w-full py-4 px-6 rounded-xl
  bg-blue-600
  text-white
  font-bold text-lg
  shadow-lg shadow-blue-500/40
  border-0
  cursor-pointer
  transition-all duration-300
  hover:bg-blue-700
  hover:shadow-xl
  hover:shadow-blue-600/50
  hover:-translate-y-1
  active:translate-y-0
  disabled:opacity-60
  disabled:cursor-not-allowed"
>
  <span className="flex items-center justify-center gap-3">
    
    {loading ? (
      <>
        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        Signing in...
      </>
    ) : (
      <>
        <span>Sign In</span>

        <span className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
          <FaArrowRight />
        </span>
      </>
    )}

  </span>
</button>
                

          </form>


          {/* Bottom Security */}

          <div className="mt-8 pt-6 border-t border-slate-100">

            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">

              <FaShieldAlt className="text-green-500" />

              Your login information is securely protected

            </div>

            <p className="text-center text-xs text-slate-400 mt-3">
              Warehouse Inventory Management System · © 2026
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;