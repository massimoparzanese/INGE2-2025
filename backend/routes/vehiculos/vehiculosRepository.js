import { estadoVehiculoRepository } from "../estadoVehiculo/estadoVehiculoRepository.js";
import { marcaRepository } from "../marca/marcaRepository.js";
import { modeloRepository } from "../modelo/modeloRepository.js";
import { politicaDeReembolsoRepository } from "../politicaDeReembolso/politicaDeReembolsoRepository.js";
import supabase from "../supabaseClient.js";
import { vehiculoEstadoRepository } from "../vehiculoEstado/vehiculoEstadoRepository.js";

export class vehiculosRepository {

    static async getAllAutos(){
        const { data, error } = await supabase
        .from('Vehiculo')
        .select(`
            politica,
            capacidad,
            kms,
            foto,
            patente,
            sucursal,
            precio,
            anio,
            Modelo (
            nombre,
            Marca (
                nombre
            )
            )
        `)
        .eq('eliminado', false);
        if (error)
            return {
                status: 400,
                message: "No se pudo obtener información de los vehículos",
                medaData: error,
            };
        return {
            status: 201,
            message: "Información de los vehículos obtenida con éxito",
            metaData: data,
        };
    }
    
    static async getSpecifyAutosInfo(sucursal){
        const { data, error } = await supabase
        .from('Vehiculo')
        .select(`
            patente,
            modelo,
            foto,
            capacidad,
            kms,
            precio,
            anio,
            Modelo (
            marca
            )
        `)
        .eq('sucursal', sucursal)
        .eq('eliminado', false);;
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

   static async eliminarVehiculo(patente){
        const hoy = new Date().toISOString();

        const { data: reservas, error: errorReservas } = await supabase
            .from("Reserva")
            .select("*")
            .eq("vehiculo", patente)
            .gte("fechafin", hoy);

        if(errorReservas){
            return {
                status: 500,
                message: "Error al verificar reservas",
                metaData: errorReservas,
            };
        }

        if (reservas.length > 0) {
            return {
                status: 400,
                message: "No se puede eliminar el vehículo porque tiene reservas activas o futuras",
                metaData: reservas,
            };
        }

        const { data: estadoData, error: errorEstado } = await supabase
            .from("vehiculo_estado")
            .select(`
                idauto,
                EstadoVehiculo: idestado (
                    estado
                )
            `)
            .eq("idauto", patente)
            .maybeSingle();

        if (errorEstado) {
            return {
                status: 500,
                message: "Error al obtener estado de vehiculo",
                metaData: errorEstado,
            };
        }

        if (estadoData?.EstadoVehiculo?.estado?.toLowerCase() === "en uso") {
            return {
                status: 400,
                message: "No se puede eliminar un vehículo que está en uso",
                metaData: estadoData,
            };
        }

        // Eliminación lógica
        const { error: errorEliminar } = await supabase
            .from("Vehiculo")
            .update({ eliminado: true })
            .eq("patente", patente);

        if (errorEliminar){
            return {
                status: 500,
                message: "Error al eliminar lógicamente el vehiculo",
                metaData: errorEliminar,
            };
        }

        return {
            status: 200,
            message: `Vehículo con patente ${patente} eliminado lógicamente.`,
        };
    }


    //editar vehiculo
    static async editarVehiculo (patente, nuevosDatos){
        const { data, error } = await supabase
        .from ('Vehiculo')
        .update({
            modelo: nuevosDatos.modelo,
            foto: nuevosDatos.foto,
            capacidad: nuevosDatos.capacidad,
            kms: nuevosDatos.kms,
            sucursal: nuevosDatos.sucursal,
            precio: nuevosDatos.precio
        })
        .eq('patente', patente);

        if(error) {
            return {
                status: 400,
                message: "Error al actualizar el vehículo",
                metaData: error,
            };
        }

        return {
            status: 200,
            message: "Vehículo actualizado correctamente",
            metaData: data,
        }
    }

    static async agregarVehiculo(nuevoVehiculo) {
   
        const { patente } = nuevoVehiculo;
        const { marca, modelo, anio } = nuevoVehiculo;
         // Verifico que no exista la patente
        const { data: existe, error: errorExistencia } = await supabase
            .from("Vehiculo")
            .select("*")
            .eq("patente", patente)
            .maybeSingle();

        if (errorExistencia && errorExistencia.code !== "PGRST116") {
            return {
                status: 500,
                message: "Error al verificar la patente",
                metaData: errorExistencia,
            };
        }

        if (existe) {
            return {
                status: 400,
                message: "La patente ya se encuentra en uso",
            };
        }
        let resultado;

        // 1. Insertar o verificar marca
        resultado = await marcaRepository.insertarMarca(marca);
        if (resultado.status > 400) return resultado;

        // 2. Insertar o verificar modelo
        resultado = await modeloRepository.insertModelo(modelo, anio, marca);
        if (resultado.status > 400) return resultado;

        // 3. Insertar estado si no existe (Disponible)
        resultado = await estadoVehiculoRepository.insertarEstado("Disponible");
        if (resultado.status > 400) return resultado;

        // 4. Insertar política si no existe
        resultado = await politicaDeReembolsoRepository.insertPolitica(nuevoVehiculo.politica);
        if (resultado.status > 400) return resultado;

        // 5. Insertar el vehículo (sin campo 'marca' si no forma parte del schema)
        const { marca: _, ...vehiculoSinMarca } = nuevoVehiculo;

        const { error: errorInsert } = await supabase
        .from("Vehiculo")
        .insert(vehiculoSinMarca)
        .select(); // Podés agregar campos específicos si querés el ID u otros

        if (errorInsert) {
        return {
            status: 500,
            message: "Error al insertar el vehículo",
            metaData: errorInsert,
        };
        }

        // 6. Insertar en tabla intermedia VehiculoEstado con estado = Disponible
        resultado = await vehiculoEstadoRepository.insertVehiculoEstado(vehiculoSinMarca.patente);
        if (resultado.status > 400) return resultado;

        // 7. Retornar éxito
        return {
        status: 200,
        message: "Vehículo insertado correctamente",
        };

    }

    static async getAutosPorEmpleado(idEmpleado) {
        // 1. Buscar la sucursal del empleado
        const { data: sucursalData, error: errorSucursal } = await supabase
            .from('Pertenece')
            .select('idsucursal')
            .eq('idempleado', idEmpleado)
            .maybeSingle();

        if (errorSucursal || !sucursalData) {
            return {
                status: 404,
                message: "No se pudo encontrar la sucursal del empleado",
                metaData: errorSucursal || {},
            };
        }

        // 2. Buscar vehículos de esa sucursal
        const { data, error } = await supabase
            .from('Vehiculo')
            .select(`
                politica,
                capacidad,
                kms,
                foto,
                patente,
                sucursal,
                precio,
                anio,
                Modelo (
                    nombre,
                    Marca (
                        nombre
                    )
                )
            `)
            .eq('sucursal', sucursalData.idsucursal)
            .eq('eliminado', false);

        if (error) {
            return {
                status: 500,
                message: "Error al obtener los vehículos de la sucursal",
                metaData: error,
            };
        }

        if (data.length === 0) {
            return {
                status: 200,
                message: "La sucursal no cuenta con vehículos para listar",
                metaData: [],
            };
        }

        return {
            status: 200,
            message: "Vehículos obtenidos correctamente",
            metaData: data,
        };
    }


}