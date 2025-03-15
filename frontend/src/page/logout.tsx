import React, { useEffect } from 'react';
import { useAuth } from '../context/auth-context'; // Assuming you're using a context to manage authentication
import { useNavigate } from 'react-router-dom'; // For navigation after logout

const Logout: React.FC = () => {
    const { logout } = useAuth(); // Accessing the logout function from context
    const navigate = useNavigate(); // For redirecting after logout

    useEffect(() => {
        logout();
        navigate('/login');
    }, [logout, navigate]); 
    return (
        <div>
            <h2>Logging out...</h2>
        </div>
    );
};

export default Logout;
