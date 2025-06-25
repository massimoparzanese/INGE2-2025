    // UserChart.jsx
import { useEffect, useRef, useState } from 'react';
import { createChart,  AreaSeries, HistogramSeries  } from 'lightweight-charts';
import Calendario from "../../components/Calendario.jsx"
export default function ClienteEstadisticasPage() {
  const [isLoading,setIsLoading] = useState(true);
  const [fechaInicio,setFechaInicio] = useState(null);
  const [fechaFin,setFechaFin] = useState(null);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
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
    <div className="flex justify-center items-center min-h-screen pt-20 ">
        <section className="bg-green-50 rounded-lg shadow-lg max-w-lg w-full p-6 relative">
      <h2 className="text-xl font-semibold mb-4 pt-12 items-center justify-center flex flex-col text-black">
        Visualizador estadisticas de Registros
      </h2>
    <Calendario setFec={setFechaInicio} minimo={"1900-01-01"} />
    {fechaInicio && (
        <Calendario setFec={setFechaFin} minimo={fechaInicio} />
    )}
    
    {fechaInicio && fechaFin &&(
        <button
                className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                onClick={() => setUsuariosFetch()}
            >
                Aceptar
        </button>
    )}
    {!isLoading && users.length > 0 && (
    <>
        <div
        ref={areaChartRef}
        style={{  width: '100%',
        height: '400px',
        backgroundColor: '#ffffff', // blanco para el chart
        border: '1px solid #ccc', // le da marco
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '8px',
        marginTop: '16px',}}
      />
      <div
        ref={histogramChartRef}
         style={{  width: '100%',
        height: '400px',
        backgroundColor: '#ffffff', // blanco para el chart
        border: '1px solid #ccc', // le da marco
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '8px',
        marginTop: '16px',}}
      />
    </>
    )}
    
    <p>{message}</p>
    </section>
    </div>
  );
}
