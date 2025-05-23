import { useState } from "react";
import imagenConsecionaria from "../imgs/imagenConsecionaria.jpg";
import SucursalSelector from '../components/SucursalesModal'
import { useNavigate } from 'react-router-dom';
export default function LandingPage() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const navigate = useNavigate();
   const handleAdminClick = () => {
    navigate('/reserva'); // Redirige a la página de registro
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <h1 className="text-4xl font-bold text-white mb-4 pt-20">Alquileres María</h1>
      <p className="text-lg mb-8">Bienvenido.</p>
      <section className="bg-amber-900 rounded-2xl">
        <h2 className="flex items-center justify-center text-4xl font-bold text-white mb-4">
          Alquilar nunca fue tan facil
        </h2>
        
            <img src={imagenConsecionaria} alt="Imagen de consecionaria" />
          <div className="flex items-center justify-center mt-4 mb-4">
            <button className=" bg-[#CDA053] text-[#FEFFFB] font-bold py-2 px-4 rounded-2xl" onClick={handleAdminClick}>
              Alquila tu auto ya
            </button>
          </div>

          <button
        onClick={() => setModalAbierto(true)}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Mostrar Sucursales
      </button>

      {modalAbierto && (
        <SucursalSelector
          onCerrar={() => setModalAbierto(false)}
        />
      )}
        
      </section>
    </div>
  );
}
