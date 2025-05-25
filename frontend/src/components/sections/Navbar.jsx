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
        </ul>
      </div>
    </nav>
  );
}
