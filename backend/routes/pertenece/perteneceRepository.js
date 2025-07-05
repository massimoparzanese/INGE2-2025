import { sucursalesRepository } from "../sucursales/sucursalRepository.js";
import supabase from "../supabaseClient.js";
export class PerteneceRepository {

    static async obtenerSucursalEmpleado(id){
        const {data, error} = await supabase
        .from('Pertenece')
        .select('idsucursal')
        .eq('idempleado', id)
        if(error){
            return {status: 400, message: 'No está autorizado para obtener la sucursal'}
        }
        const result = await sucursalesRepository.getSucursalById(data[0].idsucursal)
        return {status: 200, sucursal: result.sucursal}
    }

    static async agregarEmpleado(idEmpleado, idSucursal){

        const {data, error} = await supabase
        .from("Pertenece")
        .insert({ idempleado:idEmpleado, idsucursal:idSucursal })
        .select();
        if(error){
            return {status: 400, message: "Error al vincular el empleado con la sucursal"}
        }
        return {status: 200, message: "Empleado vinculado con éxito"}
    }
}