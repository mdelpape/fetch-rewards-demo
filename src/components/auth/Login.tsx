"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import Button from "@/components/atoms/Button";
import { Loader } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { triggerToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(name, email);
    setLoading(false);
    triggerToast({
      title: "Login Successful",
      description: "You have successfully logged in",
    });
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full max-w-md bg-white">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button
          type="submit"
          className="bg-blue-300 text-black font-bold py-3 rounded-lg hover:bg-blue-400 transition duration-200 justify-center flex"
        >
          {loading ? <Loader className="animate-spin" /> : "Login"}
        </Button>
      </form>
    </div>
  );
}
