import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the AuthContextType interface
interface AuthContextType {
  isLoggedIn: boolean;
  user: any;
  login: (userData: any) => void;
  logout: () => void;
  isTokenExpired:()=>boolean;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {


  // Helper function to check if the token is expired
  //TODO: Put in different util file
  const isTokenExpired = () => {
    const token = localStorage.getItem('authToken');
    const tokenExpiration = localStorage.getItem('authTokenExpiration');

    if (!token || !tokenExpiration) {
      return true;
    }
    const currentTime = Date.now();
    console.log(currentTime, parseInt(tokenExpiration), currentTime >= parseInt(tokenExpiration) + 40 * 60 * 60)
    return currentTime >= parseInt(tokenExpiration) + 40 * 60 * 60;
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(isTokenExpired() || false);
  const [user, setUser] = useState<any>(null);

  // On initial load, check if token exists and if it's expired
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const tokenExpiration = localStorage.getItem('authTokenExpiration');
    console.log(token, tokenExpiration, !isTokenExpired())
    if (token && tokenExpiration && !isTokenExpired()) {
      setIsLoggedIn(true);
    } else {
      logout(); // Clear the user data if the token is expired or missing
    }
  }, []);

  // Login function to store user and token data in localStorage
  const login = (userData: any) => {
    const expirationTime = Date.now() + 40 * 60 * 1000; // Example: 40 minutes from now
    localStorage.setItem('authToken', userData.access_token);
    localStorage.setItem('authTokenExpiration', expirationTime.toString());

    setUser(userData);
    setIsLoggedIn(true);
  };

  // Logout function to clear user and token data from localStorage
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokenExpiration');
    localStorage.removeItem('user');

    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, isTokenExpired }}>
      {children}
    </AuthContext.Provider>
  );
};
