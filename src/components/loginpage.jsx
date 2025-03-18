import React, { useState } from "react";

// Load users from localStorage or use default ones
const getUsers = () => {
  return JSON.parse(localStorage.getItem("users")) || [
    { username: "john", email: "john@example.com", password: "password123", tasks: [] },
    { username: "jane", email: "jane@example.com", password: "password456", tasks: [] },
    { username: "admin", email: "admin@example.com", password: "admin123", tasks: [] }
  ];
};

const LoginPage = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ text: "", type: "" });
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setMessage({ text: "", type: "" });
  };

  // Function to check if a username exists
  const checkUserExists = (username) => {
    const users = getUsers();
    return users.find(user => user.username.toLowerCase() === username.toLowerCase());
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let users = getUsers();

      if (isSignUp) {
        // **SIGN UP FLOW**
        const existingUser = checkUserExists(formData.username);

        if (existingUser) {
          setMessage({ text: "⚠️ Username already exists. Please choose another one.", type: "error" });
        } else {
          // Add new user to `localStorage`
          const newUser = { username: formData.username, email: formData.email, password: formData.password, tasks: [] };
          users.push(newUser);
          localStorage.setItem("users", JSON.stringify(users)); // Save updated users list

          setMessage({ text: "✅ Account created successfully! You can now log in.", type: "success" });

          setTimeout(() => setIsSignUp(false), 1500); // Switch to login after success
        }
      } else {
        // **LOGIN FLOW**
        const existingUser = users.find(user => 
          user.username.toLowerCase() === formData.username.toLowerCase() &&
          user.password === formData.password
        );

        if (!existingUser) {
          setMessage({ text: "❌ Incorrect username or password.", type: "error" });
        } else {
          setMessage({ text: "✅ Login successful!", type: "success" });

          setTimeout(() => onLogin(existingUser), 1000); // Redirect to Home after login
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      setMessage({ text: "⚠️ An error occurred. Please try again later.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          {isSignUp ? "Sign Up" : "Log In"}
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

        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder={isSignUp ? "Choose a username" : "Enter your username"}
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {isSignUp && (
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 text-white rounded-md ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Processing..." : (isSignUp ? "Create Account" : "Log In")}
          </button>
        </form>
        
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </span>{" "}
          <button
            type="button"
            onClick={toggleForm}
            className="text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
