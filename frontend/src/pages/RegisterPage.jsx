import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContextFunct';

export default function RegistroUsuario({role}){

  const navigate = useNavigate(); // Hook para navegar entre rutas
  const { isAuthenticated} = useContext(AuthContext);
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    fechanacimiento: '',
    rol: 'cliente', // O el valor predeterminado que uses
    password: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    const url = role === 'empleado' ? 'auth/registro-presencial' : 'auth/registro';
    try {
      const response = await fetch(`http://localhost:3001/${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok && result.status < 400) {
        setMensaje(`✅ Registro exitoso.`);
        navigate('/login')
        
      } else {
        setError(`❌ ${result.error}`);
      }
    } catch (err) {
      console.error('❌ Error detectado:', err);
      setError('❌ Error inesperado al intentar registrar.');
    }
  };
  useEffect(() => {
    if(isAuthenticated){
      navigate('/')
    }
    }, [isAuthenticated, navigate]);

  return (
    <section className="pt-10 pb-10">
    <div className="max-w-md mx-auto mt-10 bg-white p-6  rounded-2xl shadow-md ">
      <h2 className="text-2xl font-bold mb-4 text-center ">Registro de Usuario</h2>

      {mensaje && <p className="text-green-600 mb-2 text-center">{mensaje}</p>}
      {error && <p className="text-red-600 mb-2 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="DNI">Número de DNI</label>
        <input
          type="text"
          name="dni"
          value={formData.dni}
          onChange={handleChange}
          placeholder="DNI"
          className="w-full p-2 border rounded-md"
          required
        />
        <label htmlFor="Nombre">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full p-2 border rounded-md"
          required
        />
        <label htmlFor="Apellido">Apellido</label>
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          placeholder="Apellido"
          className="w-full p-2 border rounded-md"
          required
        />
        <label htmlFor="Email">Dirección de correo</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Correo electrónico"
          className="w-full p-2 border rounded-md"
          required
        />
        <label htmlFor="FechaNacimiento">Fecha de Nacimiento</label>
        <input
          type="date"
          name="fechanacimiento"
          value={formData.fechanacimiento}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
        { role !== 'empleado' && (
          <>
        <label htmlFor="password">Contraseña</label>
        <input
          type="password" name="password" 
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          placeholder='Contrasenia'
          required
        />
        </>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          {role === 'empleado' ? 'Registrar cliente' : 'Registrarme'}
        </button>
      </form>
    </div>
    </section>
  );
};
