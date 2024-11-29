"use client";
import React, { useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Tidak menggunakan destructuring
import { useRouter } from "next/navigation"; // Import dari next/navigation

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter(); // Inisialisasi useRouter

  const handleLogin = async () => {
    interface LoginResponse {
      userId: string;
      username: string;
      password: string;
      email: string;
    }
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);

      // Decode token
      const decodedToken: LoginResponse = jwtDecode(token);
      const userId = decodedToken.userId;
      localStorage.setItem("userId", userId);

      alert("Login berhasil!");
    } catch (error) {
      setMessage("Login gagal. Pastikan email dan password benar.");
      console.error("Login gagal:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-sm p-8 bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          Login
        </h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 p-3 rounded-md w-full"
            />
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 p-3 rounded-md w-full"
            />
          </div>

          {/* Message */}
          {message && (
            <div className="text-red-500 text-sm text-center">{message}</div>
          )}

          {/* Login Button */}
          <div className="flex justify-center">
            <button
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md w-full"
            >
              Login
            </button>
          </div>
        </form>

        {/* Register Link */}
        <div className="text-center mt-4">
          <span className="text-gray-400">Dont have an account?</span>
          <button
            onClick={() => router.push("/register")} // Navigasi ke halaman register
            className="text-blue-400 hover:text-blue-500 font-semibold"
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
