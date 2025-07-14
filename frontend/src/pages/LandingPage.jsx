import { useContext,useState, useEffect } from "react";
import imagenConsecionaria from "../imgs/imagenConsecionaria.jpg";
import SucursalSelector from '../components/SucursalesModal'
import { useNavigate } from 'react-router-dom';
import ProductCard from "../components/ProductCard";
import { AuthContext } from "../context/AuthContextFunct";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom"; 


export default function LandingPage() {
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const { user, isAuthenticated, setIsAuthenticated, setRole, setUser, role } = useContext(AuthContext);
  const navigate = useNavigate();
   const handleAdminClick = () => {
    const text = isAuthenticated ? '/reserva' : '/registro';
    navigate(text); // Redirige a la página de registro
  };

useEffect(() => {
  if (sessionStorage.getItem('loginSuccess') === 'true' ) {
    setShowSuccess(true);
    sessionStorage.removeItem('loginSuccess');

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  }
}, [isAuthenticated]);
  useEffect(() => {
  if (sessionStorage.getItem('loggedOut') === 'true') {
    setShowLogoutMessage(true);
    sessionStorage.removeItem('loggedOut');
    setTimeout(() => setShowLogoutMessage(false), 3000); // Ocultar en 3 seg
    
  }
}, [isAuthenticated]);


  useEffect(() => {
    console.log('valiationnn');
      const hash = window.location.hash.substring(1); // elimina el "#"
      const params = new URLSearchParams(hash);

      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
     if (access_token && refresh_token){
         const createSesion = async(access_token, refresh_token) => { 
            try {
              const response = await fetch('http://localhost:3001/api/verify/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include', // Para enviar y recibir cookies
              body: JSON.stringify({ access_token, refresh_token }),
              });
  
              const data = await response.json();
              console.log(data);
  
              if (data.status < 400) {
                setRole(data.rol);
                setUser(data.nombre)
                setIsAuthenticated(true);
                sessionStorage.setItem('loginSuccess', 'true');  
                console.log('if')
              }
  
            } catch (e){
                console.log(e);
            }
        }
  
        createSesion(access_token, refresh_token);
     }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <h1 className="text-4xl font-bold text-white mb-4 pt-20">Alquileres María</h1>
      <p className="text-lg text-white mb-8">Bienvenido/a {user}</p>
      
      <section className="relative">
            {showSuccess && (
              <div className="absolute inset-0 bg-transparent bg-opacity-50 z-40 flex items-center justify-center">
                <div className="bg-green-100 text-green-700 p-6 rounded-md shadow-md 
                                transition-all duration-500 pointer-events-none select-none z-50">
                  Inicio de sesión exitoso
                </div>
              </div>
            )}
            {showLogoutMessage && (
              <div className="absolute inset-0 bg-transparent bg-opacity-50 z-40 flex items-center justify-center">
                <div className="bg-green-100 text-green-700 p-6 rounded-md shadow-md 
                                transition-all duration-500 pointer-events-none select-none z-50">
                  Se cerró sesión correctamente
                </div>
              </div>
            )}

            <img className="rounded-2xl"src={imagenConsecionaria} alt="Imagen de consecionaria" />
           {!isAuthenticated && 
           <p className="flex items-center justify-center text-white p-4">¿No tenés una cuenta?</p>
           }
          <div className="flex items-center justify-center mt-4 mb-4">
           {role !== 'admin' && role !== 'empleado' && (
            <button
              className="nav-link inline-block px-4 py-2 rounded-md font-semibold transition-all duration-300 ease-in-out
                        bg-green-600 text-white hover:bg-green-500 hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
              onClick={handleAdminClick}
            >
              {isAuthenticated ? 'Ver sucursales disponibles' : 'Registrarme'}
            </button>
          )}
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
      {role !== 'empleado' && (
      <ProductCard 
      title={"Nuestros vehículos"} 
      subtitle={"Aquí encontrarás todo lo que necestias"}
      imageUrl={imagenConsecionaria}
      content={"Tenemos autos de todas las marcas, colores y capacidades"}
      customButton={
            <button
              onClick={() => navigate('/admin/catalogoVehiculos')}
              className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Ver catálogo
            </button>
      }/>
      )}
    </section>
      {modalAbierto && (
        <SucursalSelector
          onCerrar={() => setModalAbierto(false)}
        />
      )}
      
  </div>
  );
}
