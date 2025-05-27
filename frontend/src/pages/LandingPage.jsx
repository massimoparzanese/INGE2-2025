import { useState } from "react";
import imagenConsecionaria from "../imgs/imagenConsecionaria.jpg";
import SucursalSelector from '../components/SucursalesModal'
import { useNavigate } from 'react-router-dom';
import ProductCard from "../components/ProductCard";
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const navigate = useNavigate();
   const handleAdminClick = () => {
    navigate('/reserva'); // Redirige a la página de registro
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <h1 className="text-4xl font-bold text-white mb-4 pt-20">Alquileres María</h1>
      <p className="text-lg text-white mb-8">Bienvenido.</p>
      <section className="bg-amber-900 rounded-2xl">
       
            <img src={imagenConsecionaria} alt="Imagen de consecionaria" />
          <div className="flex items-center justify-center mt-4 mb-4">
            <button className=" bg-[#CDA053] text-[#FEFFFB] font-bold py-2 px-4 rounded-2xl" onClick={handleAdminClick}>
              Alquila tu auto ya
            </button>
          </div>
      </section>
    <h3 className="text-4xl font-bold text-white mb-4 pt-20">Todo sobre nosotros</h3>
    <section className="grid gap-6 w-full px-4 md:px-0 md:w-11/12 md:mx-auto 
    grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-auto min-h-[70vh] pb-20">
      
      <ProductCard 
      title={"Nuestras sucursales"} 
      subtitle={"Aquí encontrarás todo lo que necestias"}
      imageUrl={imagenConsecionaria}
      content={"Tenemos sucursales en todo el país"}
      customButton={
            <button
              onClick={() => setModalAbierto(true)}
              className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Ver Sucursales
            </button>
      }/>
      <ProductCard 
      title={"Nuestros vehículos"} 
      subtitle={"Aquí encontrarás todo lo que necestias"}
      imageUrl={imagenConsecionaria}
      content={"Tenemos autos de todas las marcas, colores y capacidades"}
      customButton={
            <button
              className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Ver catálogo
            </button>
      }/>
    </section>
      {modalAbierto && (
        <SucursalSelector
          onCerrar={() => setModalAbierto(false)}
        />
      )}
      {(
        <div className="flex justify-end w-full px-6 mt-4 mb-10">
        <Link to="/agregar-vehiculo">
          <button className="bg-red-600 text-white border border-black px-4 py-2 rounded-full hover:bg-black transition">
            Agregar un vehiculo
          </button>
        </Link>
      </div>
      )}
  </div>
  );
}
