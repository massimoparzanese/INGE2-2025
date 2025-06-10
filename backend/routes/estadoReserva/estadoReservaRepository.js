import supabase from "../supabaseClient";

export class estadoReservaRepository {
    static async insertarEstado(estado){
        const { data: existing, error: errorCheck } = await supabase
            .from('EstadoReserva')
            .select()
            .eq('nombre', estado)
            .limit(1);

    if (!existing || existing.length === 0) {
    const { data: inserted, error: errorInsert } = await supabase
        .from('EstadoReserva')
        .insert({ nombre: estado })
        .select();

    if (errorInsert) {
        return {status:400, message:'Error al insertar'}
    } else {
        return {status: 200, message: 'Se inserto correctamente'}
    }
    } else {
        return {
            status:200,
            message: 'Ya existe ese estado'
        }
    }   
    }
}