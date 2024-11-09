import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc"; // Google Icon
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        
        {/* Google Sign-In Button */}
        <Button
          variant="outline"
          className="flex items-center justify-center w-full py-2 text-gray-700 mb-4 border border-gray-300 hover:bg-gray-50"
        >
          <FcGoogle className="mr-2 text-xl" />
          Sign Up with Google
        </Button>
        
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="mx-4 text-gray-500"> OR </span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>

        <div className="space-y-4">
          {/* Name Input */}
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />

          {/* Email Input */}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />

          {/* Password Input with Show/Hide toggle */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pr-10"
            />
            <button
              type="button"
              onClick={handlePasswordToggle}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500"
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>

          {/* Signup Button */}
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md">
            Sign Up
          </Button>
        </div>

        {/* Link to Login Page */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
