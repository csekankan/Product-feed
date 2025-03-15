import React, { useState } from 'react';
import { createUser } from '../services/api-service';
import '../css/register.css'; 
import { NavBar } from '../components/navbar';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate()
  const handleCreateAccount = async () => {
    setLoading(true);
    setError('');
     createUser(email, password).then( res=>navigate('/login')).catch( (e)=>{
      setLoading(false);
      setError('Account creation failed. Please try again.');
      console.error('Account creation failed:', error);
    
  })
     
  };

  return (
    <div>
      <NavBar/>
    <div className="register-container">
      <h2 className="register-title">Create Account</h2>
      <div className="input-group">
        <input
          className="register-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </div>
      <div className="input-group">
        <input
          className="register-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <button className="register-button" onClick={handleCreateAccount} disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </div>
    </div>
  );
};

export default Register;
