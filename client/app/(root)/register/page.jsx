"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/Firebase/Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setIsRegistered(true);
      setTimeout(() => {
        setIsRegistered(false);
        router.push("../../components");
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth, provider);
      setIsRegistered(true);
      setTimeout(() => {
        setIsRegistered(false);
        router.push("../../components");
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-700 ">
      <div className="bg-gray-900 p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center text-white mb-4">
          Register
        </h1>
        <form onSubmit={handleRegister} className="flex flex-col gap-2">
          <label className="text-white">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-2 text-neutral-950"
            placeholder="Enter your email"
            required
          />
          <label className="text-white">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-2  text-neutral-950"
            placeholder="Create a password"
            required
          />
          <label className="text-white">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded mb-2  text-neutral-950"
            placeholder="Confirm your password"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Register
          </button>
        </form>
        <button
          onClick={handleGoogleSignUp}
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 mt-3"
        >
          Sign Up with Google
        </button>
        <p className="text-white mt-4 text-center">
          Already have an account?{" "}
          <Link href="" className="text-blue-400">
            Login here
          </Link>
        </p>
      </div>
      {isRegistered && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-3 rounded-lg shadow-lg">
          Registration successful!
        </div>
      )}
    </div>
  );
}
