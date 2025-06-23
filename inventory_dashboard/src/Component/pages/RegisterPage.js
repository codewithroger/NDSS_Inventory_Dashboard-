import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { email, password });
      login(data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      alert(err.response?.data?.msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register</h2>

        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          type="password"
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-600 text-white py-3 rounded transition ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
          }`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 hover:underline">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
