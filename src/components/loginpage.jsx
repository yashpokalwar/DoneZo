import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/login', { username, password });
      if (response.data.success) {
        console.log
        navigate('/');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-bold text-gray-900">Sign in to your account</h2>
        {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded">{error}</div>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className="border border-gray-300 py-3 px-4 rounded-lg w-full" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="border border-gray-300 py-3 px-4 rounded-lg w-full" />
          <button type="submit" disabled={loading} className="w-full py-3 bg-black text-white rounded-lg">{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <p className="text-center text-sm text-gray-600">Don't have an account? <Link to="/register" className="text-blue-600">Sign up</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
