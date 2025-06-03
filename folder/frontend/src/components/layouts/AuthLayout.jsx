import React from 'react';
import { useLocation } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);

  if (!isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="auth-page">
      {children}
      <style dangerouslySetInnerHTML={{
        __html: `
          .auth-page {
            min-height: 100vh;
            width: 100%;
            position: relative;
            z-index: 1;
          }
          
          .auth-page nav,
          .auth-page footer {
            display: none !important;
          }
        `
      }} />
    </div>
  );
};

export default AuthLayout; 