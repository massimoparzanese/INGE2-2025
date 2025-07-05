import { useState } from "react";

const DevolverAutoPage = () => {
  const [patente, setPatente] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const response = await fetch("http://localhost:3001/vehiculos/devolver-auto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ patente })
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje(data.mensaje);
        setPatente("");
      } else {
        setError(data.error || "❌ Error al devolver el auto.");
      }
    } catch (err) {
      setError("❌ Error inesperado.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-red-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Devolver Auto</h2>

        {mensaje && <p className="text-green-600 mb-2 text-center">{mensaje}</p>}
        {error && <p className="text-red-600 mb-2 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={patente}
            onChange={(e) => setPatente(e.target.value)}
            placeholder="Patente del auto"
            className="w-full border p-2 rounded-md"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Devolver auto
          </button>
        </form>
      </div>
    </div>
  );
};

export default DevolverAutoPage;