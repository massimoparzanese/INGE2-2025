import supabase from "../supabaseClient.js";

export class ReservaEstadoRepository {
    static async cambiarEstado(idReserva, nuevoEstado) {
        // 1. Buscar la reserva original para obtener las fechas
        const { data: reservas, error: errorReserva } = await supabase
        .from('Reserva')
        .update({ fechafin: new Date().toISOString().split('T')[0] })
        .eq('id', idReserva)
        .select()
        .single();


        if (errorReserva) {
            return {
                status: 400,
                message: "Error al obtener la reserva",
                metaData: errorReserva
            };
        }
        // 2. Insertar nuevo estado con esas fechas
        const reservaEstado = {
            reserva: idReserva,
            estado: nuevoEstado,
            fechainicio: reservas.fechainicio,
            fechafin: null
        };

        const { data, error } = await supabase
            .from('reserva_estado')
            .insert(reservaEstado)
            .select();
        
            
        if (error) {
            return {
                status: 400,
                message: "Error al insertar el nuevo estado",
                metaData: error
            };
        }

        return {
            status: 200,
            message: `Estado cambiado a '${nuevoEstado}' para la reserva ${idReserva}`,
            metaData: data
        };
    }
}
