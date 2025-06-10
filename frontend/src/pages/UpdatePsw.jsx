import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from '../context/AuthContextFunct';
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordPage (){
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const {auxUser, setAuxUser} = useContext(AuthContext);
    const navigate = useNavigate();
     
    const handleSubmit = async (e) => {
            e.preventDefault();
            setMensaje('');
            setError('');

            try {
            const response = await fetch('http://localhost:3001/acceso/actualizar-email', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include', // Para enviar y recibir cookies
                body: JSON.stringify({ user: sessionStorage.getItem('email') , password}),
            });
            const data = await response.json();
            if(!response.ok && data.status < 400){
                setError(response.message);
            }
            else{
                sessionStorage.removeItem('email');
                setMensaje(data)
                setAuxUser(null)
                console.log(mensaje)
                navigate('/login');
            }
            
            }catch(err){
                console.log(err);
            }
    }
    useEffect(() => {
        console.log(sessionStorage.getItem('email'))
      }, []);
    return (
        <section className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4">
        <div className="max-w-md bg-gradient-to-t from-[#24222B] to-[#19171e] rounded-3xl p-8 pt-20 border-4 border-[#24222B] shadow-blog-main m-5 mx-auto">
           <h1 className="text-left text-[#FEFFFB] font-poppins text-4xl">Actualizar mi contraseña</h1>
            <form className="mt-5 mx-auto" onSubmit={handleSubmit}>
            <label htmlFor="password"className="text-white">Ingrese nueva contraseña:</label>
            <input required className="w-full bg-[#FEFFFB] border-none p-4 rounded-2xl mt-4 shadow-blog-main border-transparent focus:outline-none focus:border-[#12B1D1]" type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} placeholder="contraseña" />
            
            {error !== '' ? (
            <p className="text-red-500 text-sm mt-4 mb-6">{error}</p>
            ) : (
            <p className="text-green-500 text-sm mt-4 mb-6">{mensaje}</p>
            )}

            <button type="submit" className="w-full bg-[#CDA053] text-[#FEFFFB] cursor-pointer font-bold py-2 px-4 rounded-2xl">
                    Actualizar mi contraseña
            </button>
            </form>
            <div className="mt-16">
                
            </div>
        </div>
        </section>
    )
}