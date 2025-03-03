import React, { useState } from "react";

// Mock database - in a real app this would come from your backend
const mockUsers = [
  { username: "john", password: "pass123" },
  { username: "jane", password: "pass456" },
  { username: "admin", password: "admin123" }
];

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "error" or "success"

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setMessage("");
    setMessageType("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isSignUp) {
      // SIGN UP LOGIC
      const userExists = mockUsers.some(user => user.username === formData.username);
      
      if (userExists) {
        setMessage("Username already taken. Please choose another.");
        setMessageType("error");
      } else {
        // In a real app, you would save this user to your database
        mockUsers.push({ username: formData.username, password: formData.password });
        console.log("New user created:", formData);
        
        setMessage("Account created successfully! You can now log in.");
        setMessageType("success");
        
        // Reset form and switch to login
        setTimeout(() => {
          setIsSignUp(false);
          setMessage("");
          setMessageType("");
          setFormData({ username: "", email: "", password: "" });
        }, 2000);
      }
    } else {
      // LOGIN LOGIC
      const user = mockUsers.find(user => user.username === formData.username);
      
      if (!user) {
        setMessage("User not found. Please check your username or sign up.");
        setMessageType("error");
        return;
      }
      
      if (user.password !== formData.password) {
        setMessage("Incorrect password. Please try again.");
        setMessageType("error");
        return;
      }
      
      setMessage("Login successful! Redirecting...");
      setMessageType("success");
      
      // In a real app, you would redirect to a dashboard
      console.log("Logged in successfully as:", formData.username);
    }
  };

  // For debugging
  const showUsers = () => {
    console.log("Current users:", mockUsers);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          {isSignUp ? "Create Account" : "Login"}
        </h2>
        
        {message && (
          <div className={`p-3 mb-4 rounded ${
            messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          {isSignUp && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <span className="text-gray-600">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </span>{" "}
          <button
            onClick={toggleForm}
            className="text-blue-500 hover:underline"
          >
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </div>
        
        {/* Debugging button - remove in production */}
        <button 
          onClick={showUsers} 
          className="mt-4 text-xs text-gray-400 hover:text-gray-600"
        >
          Debug: View Users
        </button>
      </div>
    </div>
  );
};

export default LoginPage;