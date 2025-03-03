import React, { useState } from 'react';
import illustration from "./assets/vector1.svg" 

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log('Logging in with:', { username, password });
    } else {
      console.log('Signing up with:', { username, email, password });
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-100">
      <div className="flex flex-col md:flex-row m-auto bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
        
        {/* Left side with SVG Illustration */}
        <div className="w-full md:w-1/2 bg-blue-50 flex flex-col items-center justify-center p-12">
          <img src={illustration} alt="Illustration" className="w-64" /> {/* ✅ SVG Imported Here */}
          <h2 className="mt-6 text-2xl font-bold text-gray-700">{isLogin ? 'Welcome Back!' : 'Join Us Today!'}</h2>
          <p className="mt-2 text-gray-600">
            {isLogin 
              ? "We're glad to see you again!" 
              : "Create an account to get started."}
          </p>
        </div>
        
        {/* Right side with form */}
        <div className="w-full md:w-1/2 py-16 px-12">
          <h2 className="text-3xl mb-4 font-bold text-gray-800">{isLogin ? 'Log In' : 'Sign Up'}</h2>
          <form onSubmit={handleSubmit}>
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
                {isLogin ? 'Log In' : 'Sign Up'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={toggleAuthMode}
                className="text-blue-600 hover:underline font-medium"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
