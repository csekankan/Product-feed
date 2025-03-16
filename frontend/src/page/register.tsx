import React, { useState, useEffect } from 'react';
import { createUser, fetchStores } from '../services/api-service';
import '../css/register.css'; 
import { NavBar } from '../components/navbar';
import { useNavigate } from 'react-router-dom';

interface Store {
  store_id: number;
  store_name: string;
  pincode: string;
}

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [storeId, setStoreId] = useState<number | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch stores when the component mounts
    const loadStores = async () => {
      try {
        const storeList = await fetchStores();
        setStores(storeList);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };
    loadStores();
  }, []);

  const handleCreateAccount = async () => {
    if (!storeId) {
      setError('Please select a store.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await createUser(email, password,storeId);
      navigate('/login');
    } catch (error) {
      setLoading(false);
      setError('Account creation failed. Please try again.');
      console.error('Account creation failed:', error);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="register-container">
        <h2 className="register-title">Create Account</h2>
        <div className="input-group">
          <select
            className="register-input"
            value={storeId || ''}
            onChange={(e) => setStoreId(Number(e.target.value))}
          >
            <option value="">Select Store</option>
            {stores.map((store) => (
              <option key={store.store_id} value={store.store_id}>
                {store.store_id} - {store.store_name} ({store.pincode})
              </option>
            ))}
          </select>
        </div>

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
