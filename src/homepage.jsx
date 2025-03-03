import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faCheck, faTrash, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faLinkedinIn, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

// Mock database for demonstration
// In a real app, this would be replaced with actual database calls
const mockUserDatabase = [
  { 
    username: "johndoe", 
    email: "john@example.com", 
    password: "password123",
    tasks: [
      { id: 1, text: "Complete project proposal", tags: ["work", "urgent"], completed: false },
      { id: 2, text: "Buy groceries", tags: ["personal"], completed: true }
    ]
  },
  { 
    username: "janedoe", 
    email: "jane@example.com", 
    password: "password456",
    tasks: [
      { id: 1, text: "Schedule dentist appointment", tags: ["health"], completed: false }
    ]
  },
  { 
    username: "admin", 
    email: "admin@example.com", 
    password: "admin123",
    tasks: []
  }
];

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newTags, setNewTags] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [sharingSocialMedia, setSharingSocialMedia] = useState(false);
  const [sharingTaskId, setSharingTaskId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear messages when user starts typing
    setMessage({ text: "", type: "" });
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setMessage({ text: "", type: "" });
  };

  // Function to check if username exists
  const checkUsernameExists = (username) => {
    // Simulate API call with timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUserDatabase.find(user => user.username.toLowerCase() === username.toLowerCase());
        resolve(user);
      }, 500); // Simulate network delay
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        // SIGN UP FLOW
        const existingUser = await checkUsernameExists(formData.username);
        
        if (existingUser) {
          setMessage({
            text: "Username already exists. Please choose another one.",
            type: "error"
          });
        } else {
          // In a real app, you would save the new user to your database here
          console.log("Creating new account:", formData);
          // Mock adding user to database with empty tasks array
          const newUser = {...formData, tasks: []};
          mockUserDatabase.push(newUser);
          
          setMessage({
            text: "Account created successfully! You can now log in.",
            type: "success"
          });
          
          // Auto switch to login form after successful signup
          setTimeout(() => {
            setIsSignUp(false);
          }, 1500);
        }
      } else {
        // LOGIN FLOW
        const existingUser = await checkUsernameExists(formData.username);
        
        if (!existingUser) {
          setMessage({
            text: "Account not found. Please check your username or sign up.",
            type: "error"
          });
        } else {
          // Verify the password matches
          if (existingUser.password === formData.password) {
            setMessage({
              text: "Login successful!",
              type: "success"
            });
            
            // Log in the user
            setCurrentUser(existingUser);
            setTasks(existingUser.tasks || []);
            setIsLoggedIn(true);
          } else {
            setMessage({
              text: "Incorrect password. Please try again.",
              type: "error"
            });
          }
        }
      }
    } catch (error) {
      setMessage({
        text: "An error occurred. Please try again later.",
        type: "error"
      });
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Update the user's tasks in the mock database before logging out
    if (currentUser) {
      const userIndex = mockUserDatabase.findIndex(user => user.username === currentUser.username);
      if (userIndex !== -1) {
        mockUserDatabase[userIndex].tasks = tasks;
      }
    }
    
    setIsLoggedIn(false);
    setCurrentUser(null);
    setTasks([]);
    setFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  const addTask = (e) => {
    e.preventDefault();
    
    if (!newTask.trim()) return;
    
    // Process tags (comma separated)
    const tagList = newTags.split(",")
      .map(tag => tag.trim())
      .filter(tag => tag !== "");
    
    // Create new task
    const newTaskObj = {
      id: tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1,
      text: newTask,
      tags: tagList,
      completed: false
    };
    
    const updatedTasks = [...tasks, newTaskObj];
    setTasks(updatedTasks);
    
    // Update user's tasks in the mock database
    if (currentUser) {
      const userIndex = mockUserDatabase.findIndex(user => user.username === currentUser.username);
      if (userIndex !== -1) {
        mockUserDatabase[userIndex].tasks = updatedTasks;
      }
    }
    
    setNewTask("");
    setNewTags("");
  };

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    
    // Update user's tasks in the mock database
    if (currentUser) {
      const userIndex = mockUserDatabase.findIndex(user => user.username === currentUser.username);
      if (userIndex !== -1) {
        mockUserDatabase[userIndex].tasks = updatedTasks;
      }
    }
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    
    // Update user's tasks in the mock database
    if (currentUser) {
      const userIndex = mockUserDatabase.findIndex(user => user.username === currentUser.username);
      if (userIndex !== -1) {
        mockUserDatabase[userIndex].tasks = updatedTasks;
      }
    }
  };

  const startEditingTask = (task) => {
    setEditingTask(task);
    setNewTask(task.text);
    setNewTags(task.tags.join(", "));
  };

  const updateTask = (e) => {
    e.preventDefault();
    
    if (!newTask.trim() || !editingTask) return;
    
    // Process tags (comma separated)
    const tagList = newTags.split(",")
      .map(tag => tag.trim())
      .filter(tag => tag !== "");
    
    const updatedTasks = tasks.map(task => 
      task.id === editingTask.id 
        ? { ...task, text: newTask, tags: tagList } 
        : task
    );
    
    setTasks(updatedTasks);
    
    // Update user's tasks in the mock database
    if (currentUser) {
      const userIndex = mockUserDatabase.findIndex(user => user.username === currentUser.username);
      if (userIndex !== -1) {
        mockUserDatabase[userIndex].tasks = updatedTasks;
      }
    }
    
    setNewTask("");
    setNewTags("");
    setEditingTask(null);
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setNewTask("");
    setNewTags("");
  };

  const toggleSocialSharing = (taskId) => {
    if (sharingTaskId === taskId) {
      setSharingSocialMedia(false);
      setSharingTaskId(null);
    } else {
      setSharingSocialMedia(true);
      setSharingTaskId(taskId);
    }
  };

  const shareToSocialMedia = (platform, taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    let shareUrl = "";
    const text = encodeURIComponent(`Check out my task: ${task.text} #${task.tags.join(' #')}`);
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${text}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${text}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${text} ${encodeURIComponent(window.location.href)}`;
        break;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    // Reset sharing state
    setSharingSocialMedia(false);
    setSharingTaskId(null);
  };

  // For testing/debugging purposes only
  const testLogin = () => {
    console.log("Current mock database:", mockUserDatabase);
  };

  // If user is logged in, show task management interface
  if (isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">DoneZo</h1>
          <div className="flex items-center">
            <span className="mr-4">Welcome, {currentUser.username}!</span>
            <button 
              onClick={logout}
              className="px-3 py-1 bg-white text-blue-600 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="container mx-auto p-4 flex-grow">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">
              {editingTask ? "Edit Task" : "Add New Task"}
            </h2>
            
            <form onSubmit={editingTask ? updateTask : addTask} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Task
                </label>
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your task"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="work, personal, urgent"
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingTask ? "Update Task" : "Add Task"}
                </button>
                
                {editingTask && (
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">My Tasks</h2>
            
            {tasks.length === 0 ? (
              <p className="text-gray-500">No tasks yet. Add a new task above!</p>
            ) : (
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li 
                    key={task.id} 
                    className={`p-3 border rounded-md ${
                      task.completed ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className={`mr-3 p-1 rounded-full ${
                            task.completed 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <FontAwesomeIcon icon={task.completed ? faCheck : faTimes} />
                        </button>
                        
                        <span className={task.completed ? 'line-through text-gray-500' : ''}>
                          {task.text}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleSocialSharing(task.id)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Share"
                        >
                          <FontAwesomeIcon icon={faShare} />
                        </button>
                        
                        <button
                          onClick={() => startEditingTask(task)}
                          className="p-1 text-yellow-600 hover:text-yellow-800"
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                    
                    {task.tags && task.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {task.tags.map((tag, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {sharingSocialMedia && sharingTaskId === task.id && (
                      <div className="mt-2 p-2 border-t">
                        <div className="flex space-x-4 justify-center">
                          <button
                            onClick={() => shareToSocialMedia('facebook', task.id)}
                            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                            title="Share to Facebook"
                          >
                            <FontAwesomeIcon icon={faFacebookF} />
                          </button>
                          
                          <button
                            onClick={() => shareToSocialMedia('twitter', task.id)}
                            className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500"
                            title="Share to Twitter"
                          >
                            <FontAwesomeIcon icon={faTwitter} />
                          </button>
                          
                          <button
                            onClick={() => shareToSocialMedia('linkedin', task.id)}
                            className="p-2 bg-blue-800 text-white rounded-full hover:bg-blue-900"
                            title="Share to LinkedIn"
                          >
                            <FontAwesomeIcon icon={faLinkedinIn} />
                          </button>
                          
                          <button
                            onClick={() => shareToSocialMedia('whatsapp', task.id)}
                            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                            title="Share to WhatsApp"
                          >
                            <FontAwesomeIcon icon={faWhatsapp} />
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Login/Signup Form
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          {isSignUp ? "Sign Up" : "Login"}
        </h2>
        
        {message.text && (
          <div 
            className={`p-3 mb-4 rounded text-sm ${
              message.type === "success" 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
        
        <form className="mt-4" onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          
          {!isSignUp && (
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          
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
              loading 
                ? "bg-blue-300 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              "Processing..."
            ) : isSignUp ? (
              "Create Account"
            ) : (
              "Login"
            )}
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
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </div>
        
        {/* For development testing only - Remove in production */}
        <button 
          onClick={testLogin} 
          className="mt-4 text-xs text-gray-400 hover:text-gray-600"
        >
          Debug: View Users
        </button>
      </div>
    </div>
  );
};

export default LoginPage;