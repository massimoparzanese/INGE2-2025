import { useState } from 'react';

const RegistroUsuario = () => {
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    fechanacimiento: '',
    rol: 'cliente' // O el valor predeterminado que uses
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

    try {
      const response = await fetch('http://localhost:3001/auth/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setMensaje(`✅ Registro exitoso. Tu legajo es: ${result.legajo}`);
        setFormData({
          dni: '',
          nombre: '',
          apellido: '',
          email: '',
          fechanacimiento: '',
          rol: 'cliente'
        });
      } else {
        setError(`❌ ${result.error}`);
      }
    } catch (err) {
      console.error('❌ Error detectado:', err);
      setError('❌ Error inesperado al intentar registrar.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Registro de Usuario</h2>

      {mensaje && <p className="text-green-600 mb-2 text-center">{mensaje}</p>}
      {error && <p className="text-red-600 mb-2 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="dni"
          value={formData.dni}
          onChange={handleChange}
          placeholder="DNI"
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          placeholder="Apellido"
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Correo electrónico"
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="date"
          name="fechanacimiento"
          value={formData.fechanacimiento}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
        {/* Si necesitás que el usuario elija rol: */}
        {/* <select
          name="rol"
          value={formData.rol}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="cliente">Cliente</option>
          <option value="admin">Admin</option>
        </select> */}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Registrarme
        </button>
      </form>
    </div>
  );
};

export default RegistroUsuario;
