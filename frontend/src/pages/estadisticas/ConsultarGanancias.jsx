import { useEffect, useRef, useState } from "react";
import {
  createChart
} from "lightweight-charts";

const ConsultarGanancias = () => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [datos, setDatos] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setDatos([]);

    if (!fechaInicio || !fechaFin) {
      setError("❌ Ingresá ambas fechas.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/ganancias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fechaInicio, fechaFin }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "❌ Error al consultar ganancias.");
        return;
      }

      if (result.length === 0) {
        setMensaje("📉 No hubo ganancias en ese período.");
      }

      setDatos(result);
    } catch (err) {
      console.error(err);
      setError("❌ Error inesperado.");
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current || datos.length === 0) return;

    // Destruir el gráfico anterior si existe
    chartContainerRef.current.innerHTML = "";

    chartRef.current = createChart(chartContainerRef.current, {
      width: 600,
      height: 300,
    });

    const barSeries = chartRef.current.addBarSeries();

    // Convertir datos a formato esperado
    const seriesData = datos.map((item, index) => ({
      time: index + 1,
      open: 0,
      high: item.total,
      low: 0,
      close: item.total,
    }));

    barSeries.setData(seriesData);
  }, [datos]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-500 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md mb-10">
        <h2 className="text-2xl font-bold text-center mb-4">
          Consultar Ganancias
        </h2>

        {mensaje && <p className="text-blue-600 text-center mb-2">{mensaje}</p>}
        {error && <p className="text-red-600 text-center mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Visualizar estadísticas
          </button>
        </form>
      </div>

      {datos.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-center font-semibold mb-2">
            Ganancias por sucursal
          </h3>
          <div ref={chartContainerRef} />
        </div>
      )}
    </div>
  );
};

export default ConsultarGanancias;
