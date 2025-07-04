import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContextFunct';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const { isAuthenticated,setIsAuthenticated , setRole, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const response = await fetch('http://localhost:3001/acceso/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Para enviar y recibir cookies
        body: JSON.stringify({ email: username, password }),
      });
      
      const data = await response.json();
      console.log(data)
      if (data.status >= 400) {
        setError(data.message);
        return;
      }
      if(data.status < 400 && data.rol !== 'admin'){
        setRole(data.rol);
        setUser(data.nombre)
        setIsAuthenticated(true);
        sessionStorage.setItem('loginSuccess', 'true');
        console.log(data.nombre)
        navigate('/');
      } else {
        setMensaje(data.message);
      }
    } catch (err) {
      console.error('Error al conectar:', err);
      setError('Error al conectar con el servidor');
    }
  };
  useEffect(() => {
    if(isAuthenticated){
      navigate('/')
    }
  }, [isAuthenticated, navigate]);
  const irARegistro = () => {
    navigate('/registro');
  };

  return (
    <div className="bg-[#24222B] min-h-screen font-sans pt-28">
      <div className="max-w-md bg-gradient-to-t from-[#24222B] to-[#19171e] rounded-3xl p-8 pt-20 border-4 border-[#24222B] shadow-blog-main m-5 mx-auto">
        <h1 className="text-left text-[#FEFFFB] font-poppins text-4xl">Iniciar sesión</h1>

        <form onSubmit={handleSubmit} className="mt-5 mx-auto">
          <input required className="w-full bg-[#FEFFFB] border-none p-4 rounded-2xl mt-4 shadow-blog-main border-transparent focus:outline-none focus:border-[#12B1D1]" type="email" name="email" id="email" onChange={(e) => setUsername(e.target.value)} placeholder="E-mail" />
          <input required className="w-full bg-[#FEFFFB] border-none p-4 rounded-2xl mt-4 shadow-blog-main border-transparent focus:outline-none focus:border-[#12B1D1]" type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          
          {error !== '' ? (
            <p className="text-red-500 text-sm mt-4 mb-6">{error}</p>
            ) : (
            <p className="text-green-500 text-sm mt-4 mb-6">{mensaje}</p>
          )}
          
          <Link
            to="/resetPassword"
            className="text-green-600 hover:underline cursor-pointer"
            >
           Olvidé mi contraseña
         </Link>
          <div className="mt-16">
            <button type="submit" className="w-full bg-[#CDA053] text-[#FEFFFB] cursor-pointer font-bold py-2 px-4 rounded-2xl">
              Iniciar sesión
            </button>
            <div className="mt-4 text-center">
                <p className="mb-2 text-white">¿No tenés una cuenta?</p>
                <button
                  onClick={irARegistro}
                  className="text-green-600 hover:underline cursor-pointer"
                >
                  Registrarme
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};