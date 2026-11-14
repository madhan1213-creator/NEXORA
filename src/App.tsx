import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/services/auth/AuthContext';
import { AppRoutes } from '@/routes';
import { DevAuthSwitcher } from '@/components/common/DevAuthSwitcher';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        {/* Floating temporary dev auth switcher for routing verification */}
        <DevAuthSwitcher />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
