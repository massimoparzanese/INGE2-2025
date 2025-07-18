import { useContext, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import imagenEmprendimiento from "../../imgs/LogoEmpresa.png"; // ✅ Ajustá el path al que uses tú (por ejemplo: /public/imgs/logo.png)
import { useNavigate } from 'react-router-dom';
import { ChevronRight, UserCircle } from "lucide-react";
import { AuthContext } from '../../context/AuthContextFunct'
export default function Navbar() {
  const [showNavbar] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(null); // puede ser 'cuenta', 'vehiculos', 'sucursales', etc.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, isAuthenticated, setIsAuthenticated, setRole, setUser, role } = useContext(AuthContext);

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
    if (menuAbierto !== null) {
      const timer = setTimeout(() => setMenuAbierto(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [menuAbierto]);
  const toggleMenu = (menu) => {
  setMenuAbierto(prev => (prev === menu ? null : menu));
};


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
        {/* Botón hamburguesa (solo visible en móvil) */}
        <button
          className="md:hidden ml-auto text-[#CDA053] focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Contenido a la derecha */}
        <ul className="hidden md:flex items-center gap-5 afacad-bold text-base text-[#CDA053]">
            {/* Cuenta */}
            <li className="relative cursor-pointer z-50">
            <div
              onClick={() => toggleMenu('cuenta')}
              className="flex items-center space-x-1 text-white hover:text-yellow-500 transition-colors duration-200"
            >
              <ChevronRight
                className={`ml-1 h-4 w-4 text-white transition-transform duration-300 ${
                  menuAbierto === 'cuenta' ? 'rotate-90 text-yellow-600' : ''
                }`}
              />
              <UserCircle className="h-6 w-6" />
              <span className="hidden md:inline">{user ? user : 'Mi cuenta'}</span>
            </div>

            <div
              className={`absolute right-0 mt-2 w-44 max-w-[90vw] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
                menuAbierto === 'cuenta' ? 'opacity-100 scale-100 max-h-96' : 'opacity-0 scale-95 max-h-0 pointer-events-none'
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
                        setMenuAbierto(null);
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
              onClick={() => toggleMenu('sucursales')}
              className="flex items-center"
            >
              <ChevronRight
                className={`ml-1 h-4 w-4 text-white transition-transform duration-300 ${
                  menuAbierto === 'sucursales' ? 'rotate-90 text-yellow-600' : ''
                }`}
              />
              <span className="text-white font-medium transition-colors duration-200 hover:text-yellow-600">
                Sucursales
              </span>
            </div>
            
            <div
              className={`absolute right-0 mt-2 w-60 max-w-[92vw] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
                menuAbierto === 'sucursales' ? 'opacity-100 scale-100 max-h-[400px]' : 'opacity-0 scale-95 max-h-0 pointer-events-none'
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
              onClick={() => toggleMenu('vehiculos')}
              className="flex items-center"
            >
              <ChevronRight
                className={`ml-1 h-4 w-4 text-white transition-transform duration-300 ${
                  menuAbierto === 'vehiculos' ? 'rotate-90 text-yellow-600' : ''
                }`}
              />
              <span className="text-white font-medium transition-colors duration-200 hover:text-yellow-600">
                Vehículos
              </span>
            </div>

            <div
              className={`absolute right-0 mt-2 w-60 max-w-[92vw] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
                menuAbierto === 'vehiculos' ? 'opacity-100 scale-100 max-h-[400px]' : 'opacity-0 scale-95 max-h-0 pointer-events-none'
              }`}
            >
              <ul>
                  {isAuthenticated && role === 'admin' && (
                    <li>
                      <Link to="/agregar-vehiculo" className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200">
                        Agregar Vehículo
                      </Link>
                    </li>
                )} 
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
                    <li>
                      <Link
                        to="/empleado/vehiculos-devolver"
                        className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200"
                      >
                        Vehículos para devolver
                      </Link>
                    </li>
                    <li>
                    <Link
                      to="/empleado/registrarAlquiler"
                      className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200"
                    >
                      Ver vehículos disponibles
                    </Link>
                  </li>
                  </>
                )}
                {role != 'empleado' &&(
                  <li>
                    <Link
                      to="/admin/catalogoVehiculos"
                      className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200"
                    >
                      Ver listado de vehículos
                    </Link>
                  </li>
                )}
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
          {isAuthenticated && role === 'empleado' &&(
            <li className="relative cursor-pointer z-50">
              <div
                onClick={() => toggleMenu('funciones')}
                className="flex items-center"
              >
                <ChevronRight
                  className={`ml-1 h-4 w-4 text-white transition-transform duration-300 ${
                    menuAbierto === 'funciones' ? 'rotate-90 text-yellow-600' : ''
                  }`}
                />
                <span className="text-white font-medium transition-colors duration-200 hover:text-yellow-600">
                  Funciones
                </span>
              </div>

              {/* Contenido desplegable */}
              <div
                className={`absolute right-0 mt-2 w-72 max-w-[92vw] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
                  menuAbierto === 'funciones' ? 'opacity-100 scale-100 max-h-[400px]' : 'opacity-0 scale-95 max-h-0 pointer-events-none'
                }`}
              >
                <ul>
                  <li>
                    <Link
                      to="/registro-presencial"
                      className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200"
                    >
                      Registrar cliente
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/entregar-auto"
                      className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200"
                    >
                      Entregar auto
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/devolver-auto"
                      className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200"
                    >
                      Devolver auto
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

          )}

        { isAuthenticated && role === 'admin' && (
        <li className="relative cursor-pointer z-50">
                    <div
                      onClick={() => toggleMenu('estadisticas')}
                      className="flex items-center"
                    >
                      <ChevronRight
                        className={`ml-1 h-4 w-4 text-white transition-transform duration-300 ${
                          menuAbierto === 'estadisticas' ? 'rotate-90 text-yellow-600' : ''
                        }`}
                      />
                      <span className="text-white font-medium transition-colors duration-200 hover:text-yellow-600">
                        Estadísticas
                      </span>
                    </div>
                    
                    <div
                      className={`absolute right-0 mt-2 w-60 max-w-[92vw] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
                        menuAbierto === 'estadisticas' ? 'opacity-100 scale-100 max-h-[400px]' : 'opacity-0 scale-95 max-h-0 pointer-events-none'
                      }`}
                    >
                      <ul>
                        
                          <li className="hidden md:block">
                            <Link to="/estadisticas/clientes" 
                            className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-b-xl transition-colors duration-200">
                              Consultar clientes
                            </Link>
                            <Link to="/estadisticas/alquileres" 
                            className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-b-xl transition-colors duration-200">
                              Consultar alquileres
                            </Link>
                            <Link to="/estadisticas/ganancias" 
                            className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-b-xl transition-colors duration-200">
                              Consultar ganancias
                            </Link>
                        </li>
                        
                        
                        
                      </ul>
                    </div>
                    
                  </li>
              )}

             { isAuthenticated && role === 'admin' && (
                <Link to="/listado-empleados">
                <button className="bg-red-600 px-3 py-2 rounded hover:bg-red-500 text-white">
                  Ver empleados
                </button>
            </Link>
              )}

        </ul>
        {/* Menú mobile colapsable */}
            <div
              className={`md:hidden w-full bg-[#24222B]/90 transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? 'max-h-[600px] opacity-100 py-4 px-6' : 'max-h-0 opacity-0 overflow-hidden'
              }`}
            >
              <ul className="flex flex-col gap-4 text-white text-sm">
                {/* Vehículos */}
                <li>
                  <Link to="/admin/catalogoVehiculos" onClick={() => setIsMobileMenuOpen(false)}>
                    Ver listado de vehículos
                  </Link>
                </li>
                {isAuthenticated && role === 'admin' && (
                  <li>
                    <Link to="/agregar-vehiculo" onClick={() => setIsMobileMenuOpen(false)}>
                      Agregar vehículo
                    </Link>
                  </li>
                )}
                {isAuthenticated && role === 'empleado' && (
                  <>
                    <li>
                      <Link to="/empleado/vehiculos" onClick={() => setIsMobileMenuOpen(false)}>
                        Vehículos de mi sucursal
                      </Link>
                    </li>
                    <li>
                      <Link to="/empleado/vehiculos-pendientes" onClick={() => setIsMobileMenuOpen(false)}>
                        Vehículos pendientes de entrega
                      </Link>
                    </li>
                  </>
                )}
                {isAuthenticated && role === 'cliente' && (
                  <li>
                    <Link to="/reserva" onClick={() => setIsMobileMenuOpen(false)}>
                      Alquilar un vehículo
                    </Link>
                  </li>
                )}

                {/* Sucursales */}
                {isAuthenticated && role !== 'admin' && (
                  <li>
                    <Link to="/reserva" onClick={() => setIsMobileMenuOpen(false)}>
                      Ver sucursales disponibles
                    </Link>
                  </li>
                )}

                {/* Funciones */}
                {isAuthenticated && role === 'empleado' && (
                  <>
                    <li>
                      <Link to="/registro-presencial" onClick={() => setIsMobileMenuOpen(false)}>
                        Registrar cliente
                      </Link>
                    </li>
                    <li>
                      <Link to="/empleado/registrarAlquiler" onClick={() => setIsMobileMenuOpen(false)}>
                        Ver vehículos disponibles
                      </Link>
                    </li>
                    <li>
                      <Link to="/entregar-auto" onClick={() => setIsMobileMenuOpen(false)}>
                        Entregar auto
                      </Link>
                    </li>
                    <li>
                      <Link to="/devolver-auto" onClick={() => setIsMobileMenuOpen(false)}>
                        Devolver auto
                      </Link>
                    </li>
                  </>
                )}

                {/* Cuenta / Sesión */}
                {!isAuthenticated ? (
                  <li>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Iniciar sesión
                    </Link>
                  </li>
                ) : (
                  <>
                    {role === 'cliente' && (
                      <li>
                        <Link to="/misReservas" onClick={() => setIsMobileMenuOpen(false)}>
                          Ver historial de reservas
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-red-400 hover:text-white"
                      >
                        Cerrar sesión
                      </button>
                    </li>
                  </>
                )}

                {/* Admin */}
                {isAuthenticated && role === 'admin' && (
                 <>
                  <li>
                    <Link to="/listado-empleados" onClick={() => setIsMobileMenuOpen(false)}>
                      Ver empleados
                    </Link>
                  </li>
                  <li>
                  <Link to="/estadisticas/clientes" onClick={() => setIsMobileMenuOpen(false)}>
                    Consultar clientes
                  </Link>
                </li>
                <li>
                  <Link to="/estadisticas/alquileres" onClick={() => setIsMobileMenuOpen(false)}>
                    Consultar alquileres
                  </Link>
                </li>
                <li>
                  <Link to="/estadisticas/ganancias" onClick={() => setIsMobileMenuOpen(false)}>
                    Consultar ganancias
                  </Link>
                </li>
                </>
                )}
              </ul>
            </div>

      </div>
    </nav>
  );
}
