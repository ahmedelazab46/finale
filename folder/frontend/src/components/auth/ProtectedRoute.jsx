import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('access');

  // إذا لم يكن المستخدم مسجل الدخول
  if (!user || !token) {
    return <Navigate to="/login" />;
  }

  // إذا كان هناك أدوار مسموح بها، تحقق من دور المستخدم
  if (allowedRoles.length > 0) {
    const hasRole = allowedRoles.some(role => {
      switch (role) {
        case 'admin':
          return user.is_superuser;
        case 'instructor':
          return user.is_instructor;
        case 'student':
          return user.is_student;
        default:
          return false;
      }
    });

    if (!hasRole) {
      return <Navigate to="/" />;
    }
  }

  return children;
}

export default ProtectedRoute;