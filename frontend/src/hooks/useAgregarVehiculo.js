import { useState } from "react";

export function useAgregarVehiculo(){
    const [mensaje, setMensaje] = useState(null)
    const [cargando, setCargando] = useState(false)

    const agregarVehiculo = async (vehiculo) => {
        setCargando(true);
        try{    // comunicación con el backend"
            const response = await fetch ('http://localhost:3001/vehiculos/agregar',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(vehiculo),
            });
            // respuesta
            const result = await response.json();
            if(!response.ok || response.status >= 400){
                setMensaje(result.menssage);
            }
            else{
            setMensaje("Vehiculo agregado con éxito")
            }
            return response.status
        }catch(error){  // en caso de error
            setMensaje("Error al agregar vehiculo");
            return false;
        }finally{
            setCargando(false);
        }
    };

    return {agregarVehiculo, mensaje, cargando}
}