import { useState, useEffect } from "react";
import AgregarConductorModal from "../components/AgregarConductorModal";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContextFunct";
import { useNavigate } from "react-router-dom";

export default function MisReservas() {
  const {isAuthenticated, user} = useContext(AuthContext);
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [reservas,setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [reservaAEliminar, setReservaAEliminar] = useState(null);
  const cancelarReserva = async (id) => {
    console.log(id)
    try {
              const response = await fetch("http://localhost:3001/estado/cancelar", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ reservaId: id })
            });
              const data = await response.json();
              if (data.status < 400) {
                // Actualizá el estado local modificando el estado de la reserva específica
                setReservas(prev =>
                  prev.map(r => {
                    if (r.id === id) {
                      // Asumimos que la reserva tiene un array reserva_estado
                      return {
                        ...r,
                        reserva_estado: r.reserva_estado.map(est =>
                          est.estado === 'activa'
                            ? { ...est, estado: 'cancelada' }
                            : est
                        ),
                      };
                    }
                    return r;
                  })
                );
                console.log(data)
              } else {
                alert(JSON.stringify(data));
              }
            } catch (err) {
              console.error(err);
              alert('Error al conectar con el servidor');
            }
          }
  
  const fetchAutos = async () => {
    try {
          const response = await fetch(`http://localhost:3001/reservas/${user}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) throw new Error('Error en la respuesta de la API');

          const data = await response.json();

          if (data) {
            setReservas(data.data || []);
            console.log(data.data);
          }
        } catch (e) {
          console.error('Error al obtener vehiculos:', e);
        }
        finally{
            setCargando(false)
        }
  }
  useEffect(() => {
    if(!isAuthenticated){
      navigate('/')
    }
    fetchAutos();
    
  } ,[isAuthenticated, user, navigate])

  function obtenerMensaje() {
   const dinero = (reservas.find(r => r.id === reservaAEliminar)?.Vehiculo.politica * reservas.find(r => r.id === reservaAEliminar)?.monto) / 100;
  return `Se le reintegrará la suma de dinero de ${dinero}USD de la reserva.`;
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <h2 className="text-2xl font-bold text-white mb-6">Historial de Reservas</h2>
      <section className="relative w-full max-w-7xl mx-auto bg-white p-5 rounded-xl shadow-md">
        {cargando ? (
          <div className="text-center">
            <p className="text-lg font-semibold mb-4">Cargando vehículos...</p>
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
           <div className="space-y-6">
              {reservas.length === 0 ? (
                <div className="text-center text-gray-600 bg-white border border-gray-200 rounded-xl p-6">
                  <p className="text-lg font-medium">No has realizado ninguna reserva </p>
                </div>
              ) : (
                reservas.map((reserva, i) => {
                let estadoActual = reserva.reserva_estado?.[reserva.reserva_estado.length - 1]?.estado;

                  return(
                  <div
                    key={reserva.id}
                    className={`flex flex-col md:flex-row gap-4 items-start p-4 rounded-xl border transition-shadow hover:shadow ${
                      estadoActual === 'cancelada'
                        ? 'bg-red-100 border-red-300'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <img
                      src={reserva.Vehiculo.foto}
                      alt={`${reserva.Vehiculo.marca} ${reserva.Vehiculo.modelo}`}
                      className="w-36 h-24 object-cover rounded-lg border"
                    />

                    <div className="flex-1 space-y-1">
                      <p className="text-lg font-semibold text-gray-800">
                        {reserva.Vehiculo.Modelo.marca} {reserva.Vehiculo.Modelo.nombre} - {reserva.Vehiculo.Modelo.anio} - {reserva.Vehiculo.capacidad} personas
                      </p>
                      <p className="text-sm text-gray-700">
                        Patente: <span className="font-medium">{reserva.vehiculo}</span>
                      </p>
                      <p className="text-sm text-gray-700">
                        Desde: {reserva.fechainicio} | Hasta: {reserva.fechafin}
                      </p>
                      <p className="text-sm text-gray-700">
                        Monto: {reserva.monto} USD
                      </p>
                      <p className="text-sm text-gray-700">
                        Politica de reembolso: {reserva.Vehiculo.politica}%
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        Estado:{' '}
                        <span
                          className={`font-semibold ${
                            estadoActual === 'cancelada'
                              ? 'text-red-600'
                              : 'text-green-600'
                          }`}
                        >
                          {estadoActual}
                        </span>
                      </p>

                      {reserva.dniConductor ? (
                        <p className="text-sm text-gray-700">
                          Conductor: <span className="font-medium">{reserva.nombreConductor}</span> (DNI: {reserva.dniConductor})
                        </p>
                      ) : (
                        <p className="text-sm text-red-600 font-semibold">Sin conductor asignado</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 mt-2 md:mt-0 md:ml-auto">
                      {estadoActual === 'activa' && (
                        <button
                          onClick={() => setReservaAEliminar(reserva.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                          Cancelar
                        </button>
                      )}
                      
                    </div>
                  </div>
                )})
              )}
              {reservaAEliminar && (
              <div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-75 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
                  <h2 className="text-lg font-semibold mb-4">¿Confirmar cancelación?</h2>
                  <p className="mb-6">¿Estás seguro de que querés cancelar esta reserva?</p>
                  <p className="mb-6">{obtenerMensaje()}</p>
                  <p className="mb-6">Tenga en cuenta que luego de la confirmación, no hay reclamos</p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setReservaAEliminar(null)}
                      className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                    >
                      No
                    </button>
                    <button
                      onClick={() => {
                        cancelarReserva(reservaAEliminar);
                        setReservaAEliminar(null);
                      }}
                      className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                    >
                      Sí, cancelar.
                    </button>
                  </div>
                </div>
              </div>
            )}

              {modalAbierto && (
                <AgregarConductorModal onCerrar={() => setModalAbierto(false)} />
              )}
            </div>

        )}
     
      </section>
    </div>
  );
}
