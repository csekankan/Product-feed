// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import {NavBar} from './navbar';

const ProtectedRoute: React.FC = () => {
  const { isTokenExpired } = useAuth();
 console.log("check",isTokenExpired())
  if (isTokenExpired()) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{display:"flex",flexDirection:"column",width:"100%",height:"100%"}}>
      <div><NavBar/> </div>
      <div style={{display:"flex",
      alignItems:"center",justifyContent:"center", height:"100%",width:"100%"}}>
         <Outlet /></div>
     
    </div>
  );
};

export default ProtectedRoute;
