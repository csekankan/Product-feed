import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/auth-context';
import { loginUser } from '../services/api-service';
import { useNavigate } from 'react-router-dom';
import '../css/login.css'; 
import { NavBar } from '../components/navbar';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login,isLoggedIn,isTokenExpired } = useAuth(); 
  const [error, setError] = useState<string>('');
  const navigate = useNavigate(); 

  useEffect(()=>{
    if(!isTokenExpired()){
      navigate('/upload');
    }
  },[])
  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      if (data && data.access_token) {
        login(data);
        navigate('/upload');
      } else {
        setError('Invalid email or password');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div >
      <NavBar/>
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <div className="input-group">
        <input
          className="login-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </div>
      <div className="input-group">
        <input
          className="login-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <button className="login-button" onClick={handleLogin}>Login</button>
    </div>
    </div>
  );
};

export default Login;
