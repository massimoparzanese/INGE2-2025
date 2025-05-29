import supabase from "../supabaseClient.js";
import { autosRepository } from "../vehiculos/vehiculosRepository.js";

export class reservasRepository {

    static async patenteEnReservas(fechaInicio, fechaFin, sucursal){
            // 1. Traer todos los autos de la sucursal
            const data = await autosRepository.getSpecifyAutosInfo(sucursal);

            if (data.status >= 400) {
                return {
                status: 400,
                message: "No se pudieron obtener los vehículos de la sucursal",
                metaData: data,
                };
            }

            const disponibles = [];

            // 2. Para cada vehículo, verificar si tiene reservas superpuestas
            for (const vehiculo of data.metaData) {
                const { data: reservas, error: errorReservas } = await supabase
                .from('Reserva')
                .select('fechainicio, fechafin')
                .eq('vehiculo', vehiculo.patente); // o vehiculo.id, según tu modelo

                if (errorReservas) {
                return {
                    status: 400,
                    message: "No se pudo obtener las reservas de un vehículo",
                    metaData: errorReservas,
                };
                }
                
                const hayConflicto = reservas.some(r =>
                overlaps(fechaInicio, fechaFin, r.fechainicio, r.fechafin)
                );

                if (!hayConflicto) {
                disponibles.push(vehiculo);
                }
            }

            return {
                status: 200,
                disponibles
            };
    }
    static async overlaps(f1, t1, f2, t2) {
        // Convertimos strings a objetos Date
        const from1 = new Date(f1);
        const to1 = new Date(t1);
        const from2 = new Date(f2);
        const to2 = new Date(t2);

    return (
        (from2 <= to1 && to2 >= from1) 
    );
}   

}