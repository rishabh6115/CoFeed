"use client";
import { token } from "@/lib/authToken";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function Home() {
  if (token) redirect("/dashboard");
  return (
    <main className="bg-slate-900 h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl text-white font-medium mb-1">
          The only website you need
        </h1>
        <h3 className="text-xl text-white font-medium mb-4">Co-Feed</h3>
        <p className="text-lg text-gray-300 mb-8">
          Explore the amazing features!
        </p>

        {/* Signup and Login buttons */}
        <div className="flex space-x-4 w-[90%] m-auto">
          <Link
            href={`/signup`}
            className="px-6 py-3 bg-green-800 text-white rounded hover:bg-green-900 flex-1"
          >
            <button>Sign Up</button>
          </Link>
          <Link
            href={`login`}
            className="px-6 py-3 bg-orange-500 text-white rounded hover:bg-orange-600 flex-1"
          >
            <button>Login</button>
          </Link>
        </div>
      </div>
    </main>
  );
}
