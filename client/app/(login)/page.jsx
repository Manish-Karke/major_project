"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Router for navigation
import { auth } from "../Firebase/Firebase"; // Correct Firebase import
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: Password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Validate Email
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle Email Submission
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setStep(2);
      setError("");
    } else {
      setError("Please enter a valid email.");
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      setTimeout(() => {
        setIsLoggedIn(false);
        router.push("../../components"); // Redirect after login
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-700">
      <div className="bg-gray-900 p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center text-white mb-4">
          Login
        </h1>

        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <label className="block text-white mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-4  text-neutral-950"
              placeholder="Enter your email"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mt-4"
            >
              Next
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleLogin}>
            <label className="block text-white mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mb-4  text-neutral-950"
              placeholder="Enter your password"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mt-4"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-white mt-4">
              New here?{" "}
              <Link href="/register" className="text-blue-400">
                Sign up
              </Link>
            </p>
          </form>
        )}
      </div>

      {/* Pop-up Notification */}
      {isLoggedIn && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-3 rounded-lg shadow-lg">
          You are logged in!
        </div>
      )}
    </div>
  );
}
