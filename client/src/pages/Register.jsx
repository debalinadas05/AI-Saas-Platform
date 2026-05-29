import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { assets } from "../assets/assets";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/register`,
        { name, email, password }
      );

      if (data.success) {
        login(data.token, data.user);
        navigate("/ai");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB]">
      <Toaster />
      <div className="bg-white p-8 rounded-xl border border-gray-200 w-full max-w-md shadow-sm">
        <div className="flex justify-center mb-6">
          <img src={assets.logo} alt="logo" className="w-36" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-700 text-center mb-1">Create account</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Start creating with AI today</p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mt-1 p-2 px-3 border border-gray-300 rounded-md text-sm outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 p-2 px-3 border border-gray-300 rounded-md text-sm outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full mt-1 p-2 px-3 border border-gray-300 rounded-md text-sm outline-none"
              placeholder="Min. 6 characters"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white py-2 rounded-lg text-sm font-medium mt-2 disabled:opacity-60 flex justify-center items-center"
          >
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"></span>
            ) : "Create account"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;