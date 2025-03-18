import React, { useState } from "react";
import illustration from "./assets/vector1.svg";
import Home from "./components/homepage";
import axios from "axios";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setMessage({ text: "", type: "" });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      if (isLogin) {
        console.log("Attempting login with:", { username, password });

        const response = await axios.post(
          "http://localhost:3001/api/login",
          { username, password },
          { withCredentials: true }
        );

        console.log("Login response:", response.data);

        if (response.data.token) {
          setUser(response.data.user);
          setIsAuthenticated(true);
          localStorage.setItem("userId", response.data.user.id);
          setMessage({ text: "Login successful!", type: "success" });
          console.log("User authenticated:", response.data.user);
        } else {
          setMessage({ text: response.data.message, type: "error" });
          console.error("Login error:", response.data.message);
        }
      } else {
        console.log("Attempting registration with:", { username, email, password });

        const response = await axios.post("http://localhost:3001/api/register", { username, email, password });

        console.log("Registration response:", response.data);

        if (response.data.success) {
          setMessage({ text: "Registration successful! Please log in.", type: "success" });
          setTimeout(() => setIsLogin(true), 1500);
        } else {
          setMessage({ text: response.data.message, type: "error" });
          console.error("Registration error:", response.data.message);
        }
      }
    } catch (error) {
      console.error("API error:", error);
      setMessage({ text: "An error occurred. Please try again.", type: "error" });
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
    setIsAuthenticated(false);
    localStorage.removeItem("userId");
    setUser(null);
  };

  if (isAuthenticated) {
    return <Home user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="flex min-h-screen bg-blue-100">
      <div className="flex flex-col md:flex-row m-auto bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
        <div className="w-full md:w-1/2 bg-blue-50 flex flex-col items-center justify-center p-12">
          <img src={illustration} alt="Illustration" className="w-64" />
          <h2 className="mt-6 text-2xl font-bold text-gray-700">
            {isLogin ? "Welcome Back!" : "Join Us Today!"}
          </h2>
          <p className="mt-2 text-gray-600">
            {isLogin ? "We're glad to see you again!" : "Create an account to get started."}
          </p>
        </div>

        <div className="w-full md:w-1/2 py-16 px-12">
          <h2 className="text-3xl mb-4 font-bold text-gray-800">
            {isLogin ? "Log In" : "Sign Up"}
          </h2>

          {message.text && (
            <div
              className={`p-3 mb-4 rounded text-sm ${
                message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleAuth}>
            <div className="mt-5">
              <input
                type="text"
                placeholder="Username"
                className="border border-gray-300 py-3 px-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {!isLogin && (
              <div className="mt-5">
                <input
                  type="email"
                  placeholder="Email"
                  className="border border-gray-300 py-3 px-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="mt-5">
              <input
                type="password"
                placeholder="Password"
                className="border border-gray-300 py-3 px-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mt-5">
              <button
                type="submit"
                className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300"
              >
                {isLogin ? "Log In" : "Sign Up"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={toggleAuthMode} className="text-blue-600 hover:underline font-medium">
                {isLogin ? "Sign Up" : "Log In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
