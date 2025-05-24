import supabase from "../supabaseClient.js";

export class autosRepository {

    static async getSpecifyAutosInfo(sucursal){
        const { data, error } = await supabase
        .from('Vehiculo')
        .select(`
            modelo,
            foto,
            capacidad,
            kms,
            Modelo (
            marca
            )
        `)
        .eq('sucursal', sucursal);
        if(error)
           return {
                    status: 400,
                    message: "No se pudo obtener información de los vehículos",
                    metaData: error,
            }
        return {
            status: 201,
            message: "Información de los vehículos obtenida con exito.",
            metaData: data,
        }   
    }
}