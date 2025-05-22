import supabase from "../supabaseClient.js";

export class sucursalesRepository {

    static async getAllSucursalesInfo(){

            let { data: sucursales, error } = await supabase.from("Sucursal").select("nombre, direccion");
            if (error)
                return {
                    status: 400,
                    message: "No se pudo obtener información de los blogs",
                    metaData: error,
                }
            return {
                status: 200,
                message: "Información de las sucursales obtenida con exito.",
                metaData: sucursales,
            };
    }
}