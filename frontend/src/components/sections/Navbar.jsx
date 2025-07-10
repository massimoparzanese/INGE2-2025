import { useContext, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import imagenEmprendimiento from "../../imgs/LogoEmpresa.png"; // ✅ Ajustá el path al que uses tú (por ejemplo: /public/imgs/logo.png)
import { useNavigate } from 'react-router-dom';
import { ChevronRight, UserCircle } from "lucide-react";
import { AuthContext } from '../../context/AuthContextFunct'
export default function Navbar() {
  const [showNavbar] = useState(true);
  const [activeRoute] = useState(true);
  const [cuentaOpen, setCuentaOpen] = useState(false);
  const [vehiculosOpen, setVehiculosOpen] = useState(false);
  const [sucursalesOpen, setSucursalesOpen] = useState(false);
  const [clientesOpen, setClientesOpen] = useState(false);

  const { user, isAuthenticated, setIsAuthenticated, setRole, setUser, role } = useContext(AuthContext);
  console.log("ROL:", role); //borrar

  const navigate = useNavigate();

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
            const data = await response.json();
            setIsAuthenticated(false);
            setUser(null);
            setRole("");
            sessionStorage.setItem('loggedOut', 'true');
            navigate('/');
            console.log(data);
          }
        }
        catch (e){
          console.log(e);
        }
  }
  useEffect(() => {
  if (cuentaOpen || vehiculosOpen || sucursalesOpen) {
    const timer = setTimeout(() => {
      setCuentaOpen(false);
      setVehiculosOpen(false);
      setSucursalesOpen(false);
      setClientesOpen(false);
    }, 8000);
    return () => clearTimeout(timer);
  }
}, [cuentaOpen, vehiculosOpen, sucursalesOpen]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-[#24222B]/35 backdrop-blur-sm transition-transform duration-300 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{ minHeight: '60px' }}
    >
      <div className="flex items-center justify-between w-full px-4 py-3">
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
            <li className="relative cursor-pointer z-50">
            <div
              onClick={() => setCuentaOpen(!cuentaOpen)}
              className="flex items-center space-x-1 text-white hover:text-yellow-500 transition-colors duration-200"
            >
              <ChevronRight
                className={`ml-1 h-4 w-4 text-white transition-transform duration-300 ${
                  cuentaOpen ? 'rotate-90 text-yellow-600' : ''
                }`}
              />
              <UserCircle className="h-6 w-6" />
              <span className="hidden md:inline">{user ? user : 'Mi cuenta'}</span>
            </div>

            <div
              className={`absolute right-0 mt-2 w-44 max-w-[90vw] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
                cuentaOpen ? 'opacity-100 scale-100 max-h-96' : 'opacity-0 scale-95 max-h-0 pointer-events-none'
              }`}
            >
              <ul>
                <li>
                  {!isAuthenticated ? (
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-xl"
                    >
                      Iniciar sesión
                    </Link>
                  ) : (
                    <Link
                      to="/"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                        setCuentaOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-xl"
                    >
                      Cerrar sesión
                    </Link>
                  )}
                  {isAuthenticated && role === 'cliente'&&(
                    <Link
                      to="/misReservas"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-xl"
                    >
                      Ver historial de reservas
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </li>
           {/* Sucursales */}
          {isAuthenticated && role !== 'admin' && (
            <li className="relative cursor-pointer z-50">
            <div
              onClick={() => setSucursalesOpen(!sucursalesOpen)}
              className="flex items-center"
            >
              <ChevronRight
                className={`ml-1 h-4 w-4 text-white transition-transform duration-300 ${
                  sucursalesOpen ? 'rotate-90 text-yellow-600' : ''
                }`}
              />
              <span className="text-white font-medium transition-colors duration-200 hover:text-yellow-600">
                Sucursales
              </span>
            </div>
            
            <div
              className={`absolute right-0 mt-2 w-60 max-w-[92vw] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
                sucursalesOpen ? 'opacity-100 scale-100 max-h-[400px]' : 'opacity-0 scale-95 max-h-0 pointer-events-none'
              }`}
            >
              <ul>
                
                  <li className="hidden md:block">
                    <Link to="/reserva" 
                    className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-b-xl transition-colors duration-200">
                      Ver sucursales disponibles
                    </Link>
                </li>
                
                
                
              </ul>
            </div>
            
          </li>
          )}

            {/* Vehículos */}
            <li className="relative cursor-pointer z-50">
            <div
              onClick={() => setVehiculosOpen(!vehiculosOpen)}
              className="flex items-center"
            >
              <ChevronRight
                className={`ml-1 h-4 w-4 text-white transition-transform duration-300 ${
                  vehiculosOpen ? 'rotate-90 text-yellow-600' : ''
                }`}
              />
              <span className="text-white font-medium transition-colors duration-200 hover:text-yellow-600">
                Vehículos
              </span>
            </div>

            <div
              className={`absolute right-0 mt-2 w-60 max-w-[92vw] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
                vehiculosOpen ? 'opacity-100 scale-100 max-h-[400px]' : 'opacity-0 scale-95 max-h-0 pointer-events-none'
              }`}
            >
              <ul>
                <li>
                  {
                    isAuthenticated && role === 'admin' && (
                  <Link
                    to="/agregar-vehiculo"
                    className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200"
                  >
                    Agregar Vehículo
                  </Link>
                )} 
                </li>
                {isAuthenticated && role === 'empleado' && (
                  <>
                    <li>
                      <Link
                        to="/empleado/vehiculos"
                        className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200"
                      >
                        Vehículos de mi sucursal
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/empleado/vehiculos-pendientes"
                        className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200"
                      >
                        Vehículos pendientes de entrega
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <Link
                    to="/admin/catalogoVehiculos"
                    className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200"
                  >
                    Ver listado de vehículos
                  </Link>
                </li>
                {isAuthenticated &&  role === 'cliente' && (
                  <li className="hidden md:block">
                    <Link to="/reserva" 
                    className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-b-xl transition-colors duration-200">
                      Alquilar un vehículo
                    </Link>
                </li>
                )}
                
              </ul>
            </div>
          </li>
          <li className="hidden md:block">
              <a
                href="/registro-presencial"
                className={`nav-link inline-block px-4 py-2 rounded-md font-semibold transition duration-300 ease-in-out
                  ${
                    activeRoute === "/reserva"
                      ? "bg-red-600 text-white shadow-lg scale-105 brightness-140"
                      : "bg-red-500 text-white hover:bg-black hover:brightness-140"
                  }`}
              >
                Registrar cliente
              </a>

            </li>
          <li className="hidden md:block">
              <a
                href="/empleado/registrarAlquiler"
                className={`nav-link inline-block px-4 py-2 rounded-md font-semibold transition duration-300 ease-in-out
                  ${
                    activeRoute === "/reserva"
                      ? "bg-red-600 text-white shadow-lg scale-105 brightness-140"
                      : "bg-red-500 text-white hover:bg-black hover:brightness-140"
                  }`}
              >
                Ver vehículos disponibles
              </a>

            </li>
              
              <Link
                to="/entregar-auto"
                className="px-4 py-2 text-white hover:bg-blue-700 rounded transition"
              >
                Entregar Auto
              </Link>
            
            <li>
              <Link to="/devolver-auto" className="hover:underline">
                Devolver auto
              </Link>
            </li>

        </ul>
      </div>
    </nav>
  );
}
