import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextFunct';

export default function AuthContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Nuevo estado de carga
  const [role, setRole] = useState("");
  const [user, setUser] = useState(null);
  useEffect(() => {
    const TOKEN_EXPIRATION_TIME = 60 * 60 * 1000; // 50 minutos en ms
    const TIME_FOR_VERIFY = 10 * 60 * 1000;
    const verifyOrRefreshSession = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/verify`, {
          method: 'POST',
          credentials: "include",
        });

        if (!response.ok) {
          setIsAuthenticated(false);
          throw new Error('Error al verificar o refrescar sesión');
        }
        const data = await response.json();
        setIsAuthenticated(true);
        setUser(data)
        setRole(data.role);
      } catch (e) {
         console.log('Error al comunicarse con el servidor', e);
      }
      finally {
        setIsLoading(false); // Termina la carga
      }
    };

    // Llamada inicial para refrescar el token al montar el componente
    verifyOrRefreshSession();

    // Guardar el tiempo de la primera verificación (inicio de la sesión)
    const sessionStartTime = Date.now();

    // Solo se ejecuta si el usuario está autenticado
    if (isAuthenticated) {
      // Verificar el tiempo restante antes de que expire el token
      const checkTokenExpiration = () => {
        const timeRemaining = Date.now() - sessionStartTime;
        if (timeRemaining >= (TOKEN_EXPIRATION_TIME)) {
          verifyOrRefreshSession(true); // Refrescar el token si está por expirar
        }
      };

      // Intervalo para verificar el tiempo restante y refrescar el token
      const intervalId = setInterval(checkTokenExpiration, TIME_FOR_VERIFY); // Verificación cada minuto

      return () => {
        clearInterval(intervalId); // Limpiar intervalo al desmontar el componente
      };
    }

  }, [isAuthenticated]); // Dependencias mínimas


  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isLoading, role, setRole, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};