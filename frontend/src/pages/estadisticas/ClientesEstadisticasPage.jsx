    // UserChart.jsx
import { useEffect, useRef, useState } from 'react';
import { createChart,  AreaSeries, HistogramSeries  } from 'lightweight-charts';
import CalendarioFechaNacimiento from '../../components/CalendarioNacimiento';
export default function ClienteEstadisticasPage() {
  const [isLoading,setIsLoading] = useState(true);
  const [fechaInicio,setFechaInicio] = useState(null);
  const [fechaFin,setFechaFin] = useState(null);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [promedioUsuarios,setPromedioUsuarios] = useState(0);
  const areaChartRef = useRef(null);
  const histogramChartRef = useRef(null);
  const areaChartInstance = useRef(null);
  const histogramChartInstance = useRef(null);

  const setUsuariosFetch = async () =>{
    const response = await fetch("http://localhost:3001/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            fechaInicio: fechaInicio, 
            fechaFin: fechaFin }),
        });
    const data = await response.json();
    if(response.ok && data.status < 400){
         if(data.users.length === 0){
                setMessage("No hubo registros en dichas fechas.")
            }
          const agrupado = {};
            data.users.forEach(({ created_at }) => {
            const fecha = created_at.split('T')[0]; // -> "2025-06-12"
            agrupado[fecha] = (agrupado[fecha] || 0) + 1;
            });

          // Convertir a array ordenado para el gráfico
          const curva = Object.entries(agrupado)
            .sort(([fechaA], [fechaB]) => fechaA.localeCompare(fechaB))
            .map(([fecha, count]) => ({
                time: fecha,
                value: Number(count) || 0,  // Convertir a número, y si no es válido, usar 0
            }));
            const usersFormatted = curva.map(({ time, value }) => ({
            time: Math.floor(new Date(time).getTime() / 1000),
            value,
            }));
           
       const total = data.users.length;

      // Asegurarse de que fechaInicio y fechaFin sean objetos Date
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      // Diferencia en días (incluyendo el mismo día)
      const diferenciaDias = Math.max(1, (fin - inicio) / (1000 * 60 * 60 * 24));

      const promedio = (total / diferenciaDias).toFixed(2);

      setTotalUsuarios(total);
      setPromedioUsuarios(promedio);

        setUsers(usersFormatted);

        setIsLoading(false);
    }
    else {
        console.log("Error al traer usuarios")
    }
  }

 useEffect(() => {
    if (isLoading || users.length === 0 || !areaChartRef.current) return;
    // configura fondo, interacción y color del texto del gráfico
    const chartOptions = {
      layout: {
        textColor: 'white',
        background: { type: 'solid', color: 'black' },
      },
      handleScroll: false,
      handleScale: false,
    };
    // Configura el contenedor
    const chart = createChart(areaChartRef.current, chartOptions);
    areaChartInstance.current = chart;
    // Le asigna los colores a las lineas 
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: '#2962FF',
      topColor: '#2962FF',
      bottomColor: 'rgba(41, 98, 255, 0.28)',
    });

    areaSeries.setData(users);
    chart.timeScale().fitContent();

    return () => {
      chart.remove();
      areaChartInstance.current = null;
    };
  }, [isLoading, users]);

  useEffect(() => {
    if (isLoading || users.length === 0 || !histogramChartRef.current) return;

    const chartOptions = {
      layout: {
        textColor: 'white',
        background: { type: 'solid', color: 'black' },
      },
    };

    const chart = createChart(histogramChartRef.current, chartOptions);
    histogramChartInstance.current = chart;

    const histogramSeries = chart.addSeries(HistogramSeries, {
      color: '#26a69a',
    });

    histogramSeries.setData(users);
    chart.timeScale().fitContent();

    return () => {
      chart.remove();
      histogramChartInstance.current = null;
    };
  }, [isLoading, users]);
  return (
    <div className="flex justify-center items-center min-h-screen pt-40 px-4 pb-10">
      <section className="bg-[#1e2a38] rounded-lg shadow-lg w-full max-w-3xl p-6 relative space-y-6">
        
        <h2 className="text-xl font-semibold text-center text-white pt-4">
          Visualizador de Estadísticas de Registros
        </h2>
        <p className='text-white'>En este apartado se pueden ingresar fechas para saber cuantos clientes se registraron
          en un rango de fechas
        </p>
        {/* Fechas y botón */}
        <div className="space-y-4">
          <label htmlFor="fechaInicio" className="text-white">Fecha inicio:</label> <br />
          <CalendarioFechaNacimiento
            value={fechaInicio}
            onChange={setFechaInicio}
            placeholder="Fecha de inicio"
            minDate={new Date('1900-01-01')}
          />
          <br />
          
          {fechaInicio && (
            <>
            <label htmlFor="fechaFin" className="text-white">Fecha de fin:</label> <br />
            <CalendarioFechaNacimiento
              value={fechaFin}
              onChange={setFechaFin}
              placeholder="Fecha de fin"
              minDate={fechaInicio}
              maxDate={new Date()}
            />
            </>
          )}

          {fechaInicio && fechaFin && (
            <div className="text-center">
              <button
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                onClick={() => setUsuariosFetch()}
              >
                Aceptar
              </button>
            </div>
          )}
        </div>

        {/* Gráficos y datos */}
        {!isLoading && users.length > 0 && (
          <div className="space-y-6">
            <div
              ref={areaChartRef}
              className="w-full h-[400px] bg-white border border-gray-300 rounded-lg shadow"
            />

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white p-4 rounded shadow">
                <p className="text-sm text-gray-500">Total registrados</p>
                <p className="text-2xl font-bold text-green-700">{totalUsuarios}</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <p className="text-sm text-gray-500">Promedio diario</p>
                <p className="text-2xl font-bold text-green-700">{promedioUsuarios}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje final */}
        {message && (
          <p className="text-center text-sm text-white mt-4">{message}</p>
        )}
      </section>
    </div>

  );
}
