import { useState } from 'react';

const EntregarAuto = () => {
  const [patente, setPatente] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const res = await fetch('http://localhost:3001/vehiculos/entregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patente, email })
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje(data.mensaje);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('❌ Error al conectar con el servidor.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Entregar Auto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="patente"
          value={patente}
          onChange={(e) => setPatente(e.target.value)}
          placeholder="Patente"
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email del cliente"
          className="w-full p-2 border rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Entregar auto
        </button>
        {mensaje && <p className="text-green-600 text-center">{mensaje}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default EntregarAuto;