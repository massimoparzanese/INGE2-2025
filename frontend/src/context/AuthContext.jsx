import { useState } from 'react';
import { AuthContext } from './AuthContextFunct';

export default function AuthContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Nuevo estado de carga


  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};