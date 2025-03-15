import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { AuthProvider } from './context/auth-context';
import Login from './page/login';
import Register from './page/register';
import FileUpload from './page/file-upload';
import { Products } from './page/products-view';
import ProtectedRoute from './components/protected';
import Logout from './page/logout';
import { ProductEdit } from './page/products-edit';

import 'font-awesome/css/font-awesome.min.css';
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <>
          {/* Toast Notifications */}
          <ToastContainer position="top-center" autoClose={3000} />
          
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/upload" element={<FileUpload />} />
              <Route path="/view" element={<Products />} />
              <Route path="/edit" element={<ProductEdit />} />
            </Route>
          </Routes>
        </>
      </Router>
    </AuthProvider>
  );
};

export default App;
