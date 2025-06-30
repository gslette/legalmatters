import React, { useState } from 'react';
import { apiService } from '../services/ApiService';

interface LoginProps {
  onAuthSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupError, setSignupError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const authResponse = await apiService.login(email, password);
      console.log('Login successful:', authResponse.user);
      onAuthSuccess();
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Invalid email or password');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await apiService.register(email, password, signupName);
      const authResponse = await apiService.login(email, password);
      console.log('Registration and login successful:', authResponse.user);
      setSignupError('');
      onAuthSuccess();
      setEmail('');
      setPassword('');
      setSignupName('');
    } catch (error) {
      console.error('Registration failed:', error);
      setSignupError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={isSignup ? handleSignup : handleLogin} className="login-form">
        <h1 className="text-red-500 text-3xl">Legal Matters</h1>
        <br/>
        <h2 className="text-red-500 font-bold text-2xl">{isSignup ? 'Sign Up' : 'Login'}</h2>
        {!isSignup && loginError && <div className="error">{loginError}</div>}
        {isSignup && signupError && <div className="error">{signupError}</div>}
        
        {isSignup && (
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              required
            />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
          {isSignup ? 'Sign Up' : 'Login'}
        </button>
        
        <div className="mt-4 text-center">
          <button 
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setLoginError('');
              setSignupError('');
            }}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
};