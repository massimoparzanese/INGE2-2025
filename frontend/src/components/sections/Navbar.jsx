import { useState } from "react";
import imagenEmprendimiento from "../../imgs/LogoEmpresa.png"; // ✅ Ajustá el path al que uses tú (por ejemplo: /public/imgs/logo.png)
import { useNavigate } from 'react-router-dom';
export default function Navbar() {
  const [showNavbar] = useState(true);
  const [activeRoute] = useState(true);
  const navigate = useNavigate();
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
          <li className="hidden md:block">
              <a
                href="/login"
                className={`nav-link inline-block px-4 py-2 rounded-md font-semibold transition duration-300 ease-in-out
                  ${
                    activeRoute === "/login"
                      ? "bg-red-600 text-white shadow-lg scale-105 brightness-140"
                      : "bg-red-500 text-white hover:bg-black hover:brightness-140"
                  }`}
              >
                Iniciar Sesión
              </a>

            </li>
            <li className="hidden md:block">
              <a
                href="/reserva"
                className={`nav-link inline-block px-4 py-2 rounded-md font-semibold transition duration-300 ease-in-out
                  ${
                    activeRoute === "/reserva"
                      ? "bg-red-600 text-white shadow-lg scale-105 brightness-140"
                      : "bg-red-500 text-white hover:bg-black hover:brightness-140"
                  }`}
              >
                Alquilar un vehículo
              </a>

            </li>
           <li className="relative group hidden md:block">
            <span className="cursor-pointer text-white font-medium transition-colors duration-200 group-hover:text-yellow-600">
              Vehículos
            </span>

            {/* Dropdown */}
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
            </ul>
          </li>


        </ul>
      </div>
    </nav>
  );
}
