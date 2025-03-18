import React, { useState } from "react";
import { useLanguage } from "../context/language.jsx"; // Import Language Context

const Home = ({ user, onLogout }) => {
  const { language, translations, changeLanguage } = useLanguage();
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const addTask = () => {
    if (taskInput.trim() === "") return;
    const newTask = {
      text: taskInput,
      tag: tagInput || "General",
      completed: false,
      dateCreated: new Date().toLocaleString(),
    };
    setTasks([...tasks, newTask]);
    setTaskInput("");
    setTagInput("");
  };

  const shareTask = (task) => {
    const taskDetails = `📌 ${task.text}\n🗂️ ${translations[language].createdOn}: ${task.dateCreated}`;

    if (navigator.share) {
      navigator
        .share({
          title: translations[language].shareTitle,
          text: taskDetails,
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(taskDetails);
      alert(translations[language].copyToClipboard);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        
        {/* Language Switcher */}
        <div className="flex justify-end">
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            className="p-2 border rounded-md focus:outline-none"
            value={language}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800">
          {translations[language].welcome}, {user.username}! 🎉
        </h2>

        {/* Search Bar */}
        <div className="mt-4">
          <input
            type="text"
            placeholder={translations[language].searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Task Input */}
        <div className="mt-4 flex space-x-2">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder={translations[language].addTaskPlaceholder}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder={translations[language].tagPlaceholder}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            {translations[language].addButton}
          </button>
        </div>

        {/* Task List */}
        <ul className="mt-4 space-y-3">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="flex flex-col p-4 border rounded-md bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {
                    const updatedTasks = [...tasks];
                    updatedTasks[index].completed = !updatedTasks[index].completed;
                    setTasks(updatedTasks);
                  }}
                  className="w-5 h-5 mr-2 cursor-pointer"
                />
                <div className="w-full">
                  <span className={`text-lg ${task.completed ? "line-through text-gray-400" : ""}`}>
                    {task.text}
                  </span>
                  <div className="text-sm text-gray-500">
                    {translations[language].createdOn}: {task.dateCreated}
                  </div>
                  <div className="text-xs text-blue-600 bg-blue-100 w-fit px-2 py-1 rounded-md mt-1">
                    {task.tag}
                  </div>
                </div>
              </div>

              {/* Task Actions */}
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  onClick={() => shareTask(task)}
                  className="bg-blue-500 text-white px-2 py-1 rounded-md"
                >
                  {translations[language].share} 🔗
                </button>
                <button
                  onClick={() => setTasks(tasks.filter((_, i) => i !== index))}
                  className="bg-red-500 text-white px-2 py-1 rounded-md"
                >
                  {translations[language].delete} 🗑
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="mt-6 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
        >
          {translations[language].logout}
        </button>
      </div>
    </div>
  );
};

export default Home;
