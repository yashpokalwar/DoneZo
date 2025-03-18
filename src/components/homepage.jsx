import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/language.jsx";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import styles

const Home = ({ user, onLogout }) => {
  const { language, translations, changeLanguage } = useLanguage();
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [completedTasks, setCompletedTasks] = useState({}); // Local state to track completed tasks

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
  
    if (!userId) {
      setMessage({ text: "User ID not found. Please log in again.", type: "error" });
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3001/api/tasks", {
        headers: { "Content-Type": "application/json", "Authorization": userId }
      });
  
      const result = await response.json();
      console.log("Fetched Tasks:", result);
  
      if (response.ok) {
        setTasks(result);
      } else {
        setMessage({ text: result.message, type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Failed to fetch tasks", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const addTask = async () => {
    if (taskInput.trim() === "") return;
  
    try {
      const newTaskDate = selectedDate instanceof Date && !isNaN(selectedDate)
        ? selectedDate.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
  
      const response = await fetch("http://localhost:3001/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": userId },
        body: JSON.stringify({
          text: taskInput,
          tag: tagInput || "General",
          userId,
          date: newTaskDate, // ✅ Always send date in YYYY-MM-DD format
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        setTasks([result, ...tasks]);
        setTaskInput("");
        setTagInput("");
        setMessage({ text: "Task added successfully!", type: "success" });
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setMessage({ text: "", type: "" });
        }, 3000);
      } else {
        setMessage({ text: result.message, type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Failed to add task", type: "error" });
    }
  };
  
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { "Authorization": userId }
      });
      if (response.ok) {
        setTasks(tasks.filter(task => task._id !== taskId));
        // Also remove from completedTasks if it exists there
        if (completedTasks[taskId]) {
          const updatedCompletedTasks = { ...completedTasks };
          delete updatedCompletedTasks[taskId];
          setCompletedTasks(updatedCompletedTasks);
        }
        setMessage({ text: "Task deleted successfully!", type: "success" });
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setMessage({ text: "", type: "" });
        }, 3000);
      } else {
        setMessage({ text: "Failed to delete task", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Failed to delete task", type: "error" });
    }
  };

  // Frontend-only task completion toggle
  const toggleTaskCompletion = (taskId) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const filteredTasks = tasks.filter(task => {
    let taskDate;
  
    try {
      // ✅ If `task.date` exists, use it, otherwise fallback to `dateCreated`
      taskDate = task.date 
        ? task.date // Already in YYYY-MM-DD format
        : task.dateCreated 
          ? new Date(task.dateCreated).toISOString().split("T")[0] 
          : null;
  
      if (!taskDate) return true; // Show tasks without a valid date
  
      // ✅ Ensure selectedDate is valid
      const selectedTaskDate = selectedDate instanceof Date && !isNaN(selectedDate)
        ? selectedDate.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
  
      return taskDate === selectedTaskDate;
    } catch (error) {
      console.error("Invalid task date:", task, error);
      return false;
    }
  });

  // Handle pressing Enter key to add task
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };
  
  // Get day classes for the calendar (to highlight days with tasks)
  const getTileClassName = ({ date }) => {
    const dateString = date.toISOString().split("T")[0];
    const hasTasksOnDate = tasks.some(task => {
      const taskDate = task.date || 
        (task.dateCreated ? new Date(task.dateCreated).toISOString().split("T")[0] : null);
      return taskDate === dateString;
    });
    
    return hasTasksOnDate ? 'has-tasks' : '';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-6 flex flex-col items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {translations[language].welcome}, {user.username}! ✨
            </h2>
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-white/20 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 border-none"
              value={language}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
          <p className="text-indigo-100 mt-1">Organize your day with style</p>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Message display */}
          {message.text && (
            <div 
              className={`p-4 mb-6 rounded-lg text-sm font-medium flex items-center justify-between animate-fadeIn ${
                message.type === "success" 
                  ? "bg-green-100 text-green-700 border-l-4 border-green-500" 
                  : "bg-red-100 text-red-700 border-l-4 border-red-500"
              }`}
            >
              <span>{message.text}</span>
              <button 
                onClick={() => setMessage({ text: "", type: "" })}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          )}
          
          {/* Date display and calendar button */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                {selectedDate.toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN', {
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric'
                })}
              </h3>
              <p className="text-sm text-gray-500">
                {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
              </p>
            </div>
            <button 
              onClick={() => setCalendarOpen(true)} 
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg flex items-center transition-all duration-200"
            >
              <span className="mr-2">📅</span> Calendar
            </button>
          </div>
          
          {/* Task input */}
          <div className="mb-6">
            <div className="flex mb-2">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new task..."
                className="w-full p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button 
                onClick={addTask} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-r-lg transition-colors duration-200"
              >
                Add
              </button>
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tag (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Tasks list */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="loader"></div>
              </div>
            ) : filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div 
                  key={task._id} 
                  className={`p-4 border rounded-lg transition-all duration-200 ${
                    completedTasks[task._id] 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="relative mr-3">
                      <input
                        type="checkbox"
                        id={`task-${task._id}`}
                        checked={completedTasks[task._id] || false}
                        onChange={() => toggleTaskCompletion(task._id)}
                        className="custom-checkbox opacity-0 absolute h-5 w-5 cursor-pointer"
                      />
                      <label 
                        htmlFor={`task-${task._id}`}
                        className={`flex h-5 w-5 border-2 rounded-md cursor-pointer transition-colors duration-200 ${
                          completedTasks[task._id] 
                            ? 'bg-indigo-600 border-indigo-600' 
                            : 'border-gray-300'
                        }`}
                      >
                        {completedTasks[task._id] && (
                          <svg className="h-full w-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </label>
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${completedTasks[task._id] ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.text}
                      </h3>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs mr-2">
                          {task.tag}
                        </span>
                        <span>
                          {task.date 
                            ? new Date(task.date + "T00:00:00Z").toLocaleDateString() 
                            : task.dateCreated 
                              ? new Date(task.dateCreated).toLocaleDateString() 
                              : "No Date"
                          }
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteTask(task._id)} 
                      className="ml-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      aria-label="Delete task"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-gray-500">No tasks for this day</p>
                <p className="text-sm text-gray-400 mt-1">Add a new task to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calendar modal */}
      {calendarOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full">
            <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
              <h3 className="text-lg font-semibold">Select a Date</h3>
              <button onClick={() => setCalendarOpen(false)} className="text-white hover:text-indigo-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <Calendar 
                onChange={date => {
                  setSelectedDate(date);
                  setCalendarOpen(false);
                }}
                value={selectedDate}
                tileClassName={getTileClassName}
              />
            </div>
          </div>
        </div>
      )}

      {/* CSS for custom styling */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a5b4fc;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .loader {
          border: 3px solid #f3f3f3;
          border-radius: 50%;
          border-top: 3px solid #6366f1;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Add custom styling for react-calendar */
        :global(.react-calendar) {
          width: 100%;
          border: none;
          font-family: inherit;
        }
        
        :global(.react-calendar__tile--active) {
          background: #6366f1 !important;
          color: white;
        }
        
        :global(.react-calendar__tile:hover) {
          background: #e0e7ff;
        }
        
        :global(.react-calendar__month-view__days__day--weekend) {
          color: #ef4444;
        }
        
        :global(.has-tasks) {
          position: relative;
        }
        
        :global(.has-tasks::after) {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 5px;
          height: 5px;
          background-color: #6366f1;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default Home;