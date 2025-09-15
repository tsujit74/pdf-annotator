import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../services/authService";
import { saveToken } from "../../utils/auth";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setErrors({});
    setLoading(true);

    try {
      const data = isLogin
        ? await login(email, password)
        : await signup(email, password);

      saveToken(data.token);
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response) {
        // Server responded with error
        if (err.response.status === 400) {
          setErrors({ general: err.response.data.message || "Invalid request" });
        } else if (err.response.status === 401) {
          setErrors({ general: "Invalid email or password" });
        } else if (err.response.status === 409) {
          setErrors({ general: "User already exists" });
        } else {
          setErrors({ general: err.response.data.message || "Something went wrong" });
        }
      } else if (err.request) {
        setErrors({ general: "Network error. Please try again later." });
      } else {
        setErrors({ general: "Unexpected error occurred" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-6">
        {isLogin ? "Login" : "Signup"}
      </h2>
      {errors.general && (
        <p className="text-red-500 text-sm mb-4">{errors.general}</p>
      )}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="text-left">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`border p-2 rounded w-full ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div className="text-left">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`border p-2 rounded w-full ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Processing..." : isLogin ? "Login" : "Signup"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => {
            setErrors({});
            setIsLogin(!isLogin);
          }}
        >
          {isLogin ? "Signup" : "Login"}
        </span>
      </p>
    </div>
  );
};

export default AuthPage;
