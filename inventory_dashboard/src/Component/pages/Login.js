import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { auth, provider } from '../Firebase/firebase';
import { signInWithPopup } from 'firebase/auth';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      alert(err.response?.data?.msg || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const { data } = await axios.post('http://localhost:5000/api/auth/google-login', { idToken });
      login(data.token);
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        console.warn('Google sign-in cancelled by user.');
        alert('Google sign-in was cancelled.');
      } else if (err.response) {
        console.error('Google login error response:', err.response.data);
        alert(err.response.data.msg || 'Google login failed. Please try again.');
      } else {
        console.error('Google login error:', err.message);
        alert('Google login failed. Please try again.');
      }
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
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-3 rounded transition ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          } mb-3`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`w-full bg-red-500 text-white py-3 rounded transition ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
          }`}
        >
          {loading ? 'Processing...' : 'Login with Google'}
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
