import React from 'react';
import { Navigate } from 'react-router-dom';
import IsAuthenticated from "./IsAuthenticated";

const ProtectedRoute = ({ element }) => 
{
    return IsAuthenticated() ? element : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
