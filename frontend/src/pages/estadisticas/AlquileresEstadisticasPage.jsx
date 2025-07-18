import { useEffect, useRef, useState } from 'react';
import { createChart, AreaSeries } from 'lightweight-charts';
import CalendarioFechaNacimiento from '../../components/CalendarioNacimiento';

const colores = [
  { linea: 'blue', top: 'rgba(0, 0, 255, 0.4)', bottom: 'rgba(0, 0, 255, 0.1)' },
  { linea: 'green', top: 'rgba(0, 128, 0, 0.4)', bottom: 'rgba(0, 128, 0, 0.1)' },
  { linea: 'red', top: 'rgba(255, 0, 0, 0.4)', bottom: 'rgba(255, 0, 0, 0.1)' },
  { linea: 'orange', top: 'rgba(255, 165, 0, 0.4)', bottom: 'rgba(255, 165, 0, 0.1)' },
];

export default function AlquileresEstadisticasPage() {
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [datosPorTipo, setDatosPorTipo] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [totalAlquileres, setTotalAlquileres] = useState(0);
  const [promedioDiario, setPromedioDiario] = useState(0);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [sinDatos, setSinDatos] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const fetchDatos = async () => {
    setBusquedaRealizada(true);
    setCargando(true);
    

    try {
        const res = await fetch("http://localhost:3001/admin/alquileres/estadisticas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fechaInicio, fechaFin }),
        });

        const data = await res.json();

        if (data.status === 200) {
        const datos = data.metaData.datos;
        const tipos = data.metaData.tipos;
        setDatosPorTipo(datos);
        setTipos(tipos);
        setSinDatos(data.metaData.sinDatos);

        // Calcular total y promedio
        const total = datos.reduce((acum, fila) => {
            return acum + tipos.reduce((sub, tipo) => sub + (fila[tipo] || 0), 0);
        }, 0);

        const dias = Math.max(1, (new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24));
        const promedio = (total / dias).toFixed(2);

        setTotalAlquileres(total);
        setPromedioDiario(promedio);
        } else {
        setDatosPorTipo([]);
        setTipos([]);
        setSinDatos(false);
        }
    } catch (error) {
        console.error("Error consultando estadísticas:", error);
        setDatosPorTipo([]);
        setTipos([]);
        setSinDatos(false);
    } finally {
        setCargando(false);
    }
    };


  useEffect(() => {
    if (!chartRef.current || datosPorTipo.length === 0 || tipos.length === 0) return;

    const chart = createChart(chartRef.current, {
      height: 400,
      layout: {
        textColor: 'white',
        background: { type: 'solid', color: '#030e1aff' }, //'#041529ff'
      },
      grid: {
        vertLines: { color: '#2c3e50' },
        horzLines: { color: '#2c3e50' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      //handleScroll: false, //agregue este y el de abajo. ver de borrar
      //handleScale: false,
    });

    chartInstance.current = chart;

    tipos.forEach((tipo, index) => {
      const serie = chart.addSeries(AreaSeries, {
        lineColor: colores[index % colores.length].linea,
        topColor: colores[index % colores.length].top,
        bottomColor: colores[index % colores.length].bottom,
        lineWidth: 3, // más grosor
        lastValueVisible: true,     // muestra la etiqueta de valor actual
        priceLineVisible: true,     // muestra la línea horizontal del último valor
      });


      const datos = datosPorTipo.map((fila) => ({
        time: Math.floor(new Date(fila.dia).getTime() / 1000),
        value: fila[tipo] || 0,
      }));

      serie.setData(datos);
    });

    return () => chart.remove();
  }, [datosPorTipo, tipos]);

  return (
    <div className="flex justify-center items-center min-h-screen pt-40 px-4 pb-10">
      <section className="bg-[#1e2a38] rounded-lg shadow-lg w-full max-w-4xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-center text-white">
          Estadísticas de Alquileres por Tipo de Vehículo
        </h2>
        <p className='text-white text-center'>
          Seleccioná un rango de fechas para visualizar la cantidad de alquileres por tipo de auto
        </p>

        {/* Fecha y botón */}
          <div className="space-y-4">
            <div className="flex gap-x-4">
              <div className="relative z-20">
                <CalendarioFechaNacimiento
                  value={fechaInicio}
                  onChange={setFechaInicio}
                  placeholder="Fecha de inicio"
                  minDate={new Date('2000-01-01')}
                />
              </div>

              {fechaInicio && (
                <div className="relative z-20">
                  <CalendarioFechaNacimiento
                    value={fechaFin}
                    onChange={setFechaFin}
                    placeholder="Fecha de fin"
                    minDate={fechaInicio}
                    maxDate={new Date()}
                  />
                </div>
              )}
            </div>

            {fechaInicio && fechaFin && (
              <div className="text-center pt-2">
                <button
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  onClick={fetchDatos}
                >
                  Consultar
                </button>
              </div>
            )}
          </div>

          {/* Leyenda */}
            {tipos.length > 0 && (
              <div className="flex justify-center gap-5 mb-2 font-bold font-sans text-white">
                {tipos.map((tipo, index) => (
                  <div key={tipo} className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: colores[index % colores.length].linea }}></div>
                    {tipo}
                  </div>
                ))}
              </div>
            )}

        {busquedaRealizada && !cargando && sinDatos && (
        <p className="text-white text-center mt-4">
            No hubo reservas registradas en el período seleccionado.
        </p>
        )}

        {/* Gráfico */}
        {datosPorTipo.length > 0 && (
          <>
            <div
              ref={chartRef}
              className="w-full h-[400px] bg-black rounded-lg"
            />


            {/* Indicadores */}
            <div className="grid grid-cols-2 gap-4 text-center text-white pt-4">
              <div className="bg-white p-4 rounded shadow text-black">
                <p className="text-sm text-gray-500">Total de alquileres</p>
                <p className="text-2xl font-bold text-green-700">{totalAlquileres}</p>
              </div>
              <div className="bg-white p-4 rounded shadow text-black">
                <p className="text-sm text-gray-500">Promedio diario</p>
                <p className="text-2xl font-bold text-green-700">{promedioDiario}</p>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
