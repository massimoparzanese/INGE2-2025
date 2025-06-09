
import { AuthContext } from '../context/AuthContextFunct'; // Asegúrate de importar el hook
import { useContext } from "react";
import LoadingScreen from "./LoadingScreen";

export default function Verification({ children }) {
    const { isAuthenticated, isLoading } = useContext(AuthContext); // Accedes al valor de isAuthenticated
    if (isLoading ) {
    // Mientras se redirige, puedes mostrar un mensaje de carga o nada
    return (
      <LoadingScreen />)

  }
  return children;
}
