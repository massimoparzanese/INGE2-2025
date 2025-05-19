import { useState } from "react";
import imagenEmprendimiento from "../../imgs/LogoEmpresa.png"; // ✅ Ajustá el path al que uses tú (por ejemplo: /public/imgs/logo.png)

export default function Navbar() {
  const [showNavbar] = useState(true);

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
          onClick={() => window.location.href = '/'} // Redirige a la página principal al hacer clic
        />

        {/* Contenido a la derecha */}
        <ul className="flex items-center gap-5 afacad-bold text-base text-[#CDA053]">
          <li className="hidden md:block">Alo</li>
        </ul>
      </div>
    </nav>
  );
}
