
import imagenConsecionaria from "../imgs/imagenConsecionaria.jpg";
import { useNavigate } from 'react-router-dom';
export default function LandingPage() {
  const navigate = useNavigate();

   const handleAdminClick = () => {
    navigate('/login'); // Redirige a la página de registro
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <h1 className="text-4xl font-bold text-black mb-4">Welcome to Our Landing Page</h1>
      <p className="text-lg mb-8">This is a simple landing page built with React and Tailwind CSS.</p>
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
        
      </section>
    </div>
  );
}
