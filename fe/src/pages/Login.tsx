import React, { useState } from 'react';
import { apiService } from '../services/ApiService';
// import type { Customer } from './models/Customer';
// import type { Matter } from './models/Matter';

export const Login: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

        try {
          const authResponse = await apiService.login(email, password);
          console.log('Login successful:', authResponse.user);
          setIsAuthenticated(true);
          setEmail('');
          setPassword('');
        } catch (error) {
          console.error('Login failed:', error);
          setLoginError('Invalid email or password');
        }
    };

    // const handleLogout = () => {
    //   apiService.logout();
    //   setIsAuthenticated(false);
    // };

    // const isUserAuthenticated = () => {
    //     return isAuthenticated;
    // }

    return (
        <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        {loginError && <div className="error">{loginError}</div>}
      
        <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        </div>
      
        <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        </div>
      
        <button type="submit">Login</button>
        </form>
        </div>
    )
}


// const [isAuthenticated, setIsAuthenticated] = useState(false);
// const [email, setEmail] = useState('');
// const [password, setPassword] = useState('');
// const [loginError, setLoginError] = useState('');
  
// export const handleLogin = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setLoginError('');
  
//   try {
//     const authResponse = await apiService.login(email, password);
//     console.log('Login successful:', authResponse.user);
//     setIsAuthenticated(true);
//     setEmail('');
//     setPassword('');
//   } catch (error) {
//     console.error('Login failed:', error);
//     setLoginError('Invalid email or password');
//   }
// };
// export const handleLogout = () => {
//   apiService.logout();
//   setIsAuthenticated(false);
// };

// export const isUserAuthenticated = () => {
//     return isAuthenticated;
// }

// export const LoginForm: React.FC = () => (
//   <div className="login-container">
//     <form onSubmit={handleLogin} className="login-form">
//       <h2>Login</h2>
//       {loginError && <div className="error">{loginError}</div>}
      
//       <div className="form-group">
//         <label htmlFor="email">Email:</label>
//         <input
//           type="email"
//           id="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//       </div>
      
//       <div className="form-group">
//         <label htmlFor="password">Password:</label>
//         <input
//           type="password"
//           id="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//       </div>
      
//       <button type="submit">Login</button>
//     </form>
//   </div>
// );