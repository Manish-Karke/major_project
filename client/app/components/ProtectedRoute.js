"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("../register"); // Redirect to login if not authenticated
    }
  }, [user, loading, router]);

  if (loading) return <p className="text-white">Loading...</p>; // Show loading indicator

  return user ? children : null;
}
