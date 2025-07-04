import supabase from "../supabaseClient.js";

export class sucursalesRepository {

    static async getAllSucursalesInfo(){

            let { data: sucursales, error } = await supabase.from("Sucursal").select("nombre, direccion,id");
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
    static async getSucursalById(id){
        const {data, error} = await supabase
        .from('Sucursal')
        .select('nombre')
        .eq('id', id)

        if(error){
             return {
                    status: 400,
                    message: "No se pudo obtener la sucursal",
                    metaData: error,
                }
        }
        return {
            status:200,
            sucursal: data[0].nombre
        }
    }
}