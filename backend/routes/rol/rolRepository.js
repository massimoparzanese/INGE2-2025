import supabase from "../supabaseClient.js";


export class rolRepository{
    static async insertRol(rol){
        const {data: roles, error: error} = await supabase
        .from('Rol')
        .select("nombre")
        .eq("nombre", rol)

        if(error){
            return { 
                status: 400,
                message: 'Error al obtener rol' };
        }else{
            if(roles.length > 0){
                return {
                    status: 200,
                    message: "El rol existe en la base de datos" 
                }
            }
            const {data, error: errorInsertar} = await supabase
            .from("Rol")
            .insert({nombre : rol})

            if(errorInsertar){
                return { 
                status: 400,
                message: 'Error al insertar el rol' };
            }else{
                return {
                    status: 200,
                    message: "Rol insertado correctamente"
                }
            }
        }
        
    }
}