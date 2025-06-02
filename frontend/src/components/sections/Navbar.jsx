import { useContext, useState } from "react";
import imagenEmprendimiento from "../../imgs/LogoEmpresa.png"; // ✅ Ajustá el path al que uses tú (por ejemplo: /public/imgs/logo.png)
import { useNavigate } from 'react-router-dom';
import { ChevronRight, UserCircle } from "lucide-react";
import { AuthContext } from '../../context/AuthContextFunct'
export default function Navbar() {
  const [showNavbar] = useState(true);
  const [activeRoute] = useState(true);
  const [cuentaOpen, setCuentaOpen] = useState(false);
  const [vehiculosOpen, setVehiculosOpen] = useState(false);
  const { user, isAuthenticated, setIsAuthenticated, setRole, setUser } = useContext(AuthContext);
  const navigate = useNavigate();


    const toggleCuenta = () => {
      setCuentaOpen((open) => !open);
      // Si querés cerrar Vehículos al abrir Cuenta:
      if (!cuentaOpen) setVehiculosOpen(false);
    };

    const toggleVehiculos = () => {
      setVehiculosOpen((open) => !open);
      // Si querés cerrar Cuenta al abrir Vehículos:
      if (!vehiculosOpen) setCuentaOpen(false);
    };
  const handleLogout = async () => {

      try {
          const response = await fetch('http://localhost:3001/session/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Para enviar y recibir cookies
          });
          if(!response.ok){
            console.log("Error al cerrar sesión")
          }
          else {
            const data = response.json();
            setIsAuthenticated(false);
            setUser(null);
            setRole("");
            console.log(data);
          }
        }
        catch (e){
          console.log(e);
        }
  }
  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-[#24222B]/35 backdrop-blur-sm transition-transform duration-300 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{ minHeight: '60px' }}
    >
      <div className="flex items-center justify-between w-full px-4 py-3"  onClick={() => setCuentaOpen(!cuentaOpen)}>
        {/* Imagen alineada a la izquierda */}
        <img
          src={imagenEmprendimiento} // Asegurate de que este importado correctamente si está en src/assets
          alt="Logo del emprendimiento"
          className="h-12 w-auto"
          onClick={() => navigate("/")} // Redirige a la página principal al hacer clic
        />

        {/* Contenido a la derecha */}
        <ul className="flex items-center gap-5 afacad-bold text-base text-[#CDA053]">
            {/* Cuenta */}
            <li className="relative group cursor-pointer">
              <div className="flex items-center space-x-1 text-white hover:text-yellow-500 transition-colors duration-200"
              onClick={toggleCuenta}
              aria-expanded={cuentaOpen}
              aria-haspopup="true">
                
                <ChevronRight className="ml-1 h-4 w-4 text-white group-hover:text-yellow-600 transition-transform duration-300 group-hover:rotate-90" />
                <UserCircle className="h-6 w-6" />
                <span className="hidden md:inline">
                {user ? user : 'Mi cuenta'}
              </span>
                
              </div>
              <ul
                className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg
                          opacity-0 invisible group-hover:visible group-hover:opacity-100
                          transition-all duration-300 z-50"
              >
                <li>
                  {!isAuthenticated ? (
                    <a
                    href="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-xl"
                  >
                    Iniciar sesión
                  </a>
                  )
                : (
                   <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-xl"
                  >
                    Cerrar sesión
                  </a>


                )}
                  
                </li>
              </ul>
            </li>

            {/* Vehículos */}
            <li className="relative group cursor-pointer">
              <div className="flex items-center"
              onClick={toggleVehiculos}
            aria-expanded={vehiculosOpen}
            aria-haspopup="true">
                <ChevronRight className="ml-1 h-4 w-4 text-white group-hover:text-yellow-600 transition-transform duration-300 group-hover:rotate-90" />
                <span className="text-white font-medium transition-colors duration-200 group-hover:text-yellow-600">
                  Vehículos
                </span>
              </div>
              <ul
                className="absolute right-0 mt-2 w-56 max-w-[90vw] bg-white border border-gray-200 rounded-xl shadow-lg 
                          opacity-0 translate-y-2 invisible group-hover:visible group-hover:opacity-100 
                          group-hover:translate-y-0 transition-all duration-300 z-50"
              >
                <li>
                  <a
                    href="/agregar-vehiculo"
                    className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-t-xl transition-colors duration-200"
                  >
                    Agregar Vehículo
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/catalogoVehiculos"
                    className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-t-xl transition-colors duration-200"
                  >
                    Ver listado de vehículos
                  </a>
                </li>
                <li className="hidden md:block">
                  <a
                    href="/reserva"
                    className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-t-xl transition-colors duration-200"
                  >
                    Alquilar un vehículo
                  </a>
                </li>
              </ul>
            </li>
        </ul>
      </div>
    </nav>
  );
}
