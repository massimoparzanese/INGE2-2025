import { estadoVehiculoRepository } from "../estadoVehiculo/estadoVehiculoRepository.js";
import { marcaRepository } from "../marca/marcaRepository.js";
import { modeloRepository } from "../modelo/modeloRepository.js";
import { politicaDeReembolsoRepository } from "../politicaDeReembolso/politicaDeReembolsoRepository.js";
import supabase from "../supabaseClient.js";
import { vehiculoEstadoRepository } from "../vehiculoEstado/vehiculoEstadoRepository.js";

export class vehiculosRepository {

  static async getAllAutos() {
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

    if (error) {
      return {
        status: 400,
        message: "No se pudo obtener información de los vehículos",
        metaData: error,
      };
    }

    return {
      status: 200,
      message: "Información de los vehículos obtenida con éxito",
      metaData: data,
    };
  }

  static async getSpecifyAutosInfo(sucursal) {
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
      .eq('eliminado', false);

    if (error) {
      return {
        status: 400,
        message: "No se pudo obtener información de los vehículos",
        metaData: error,
      };
    }

    return {
      status: 200,
      message: "Información de los vehículos obtenida con éxito.",
      metaData: data,
    };
  }

  static async getAutosPorEmpleado(idEmpleado) {
    // 1. Buscar el ID de la sucursal del empleado
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

    // 2. Buscar el nombre de la sucursal
    const { data: sucursalNombreData, error: errorNombre } = await supabase
      .from('Sucursal')
      .select('nombre')
      .eq('id', sucursalData.idsucursal)
      .maybeSingle();

    if (errorNombre || !sucursalNombreData) {
      return {
        status: 404,
        message: "No se pudo obtener el nombre de la sucursal",
        metaData: errorNombre || {},
      };
    }

    const nombreSucursal = sucursalNombreData.nombre;

    // 3. Buscar vehículos de esa sucursal (usando el nombre)
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
      .eq('sucursal', nombreSucursal)
      .eq('eliminado', false);

    if (error) {
      return {
        status: 500,
        message: "Error al obtener los vehículos de la sucursal",
        metaData: error,
      };
    }

    return {
      status: 200,
      message: data.length > 0 
        ? "Vehículos obtenidos correctamente"
        : "La sucursal no cuenta con vehículos para listar",
      metaData: data,
    };
  }


  // Otros métodos (agregar, editar, eliminar, entregar, devolver) aquí...

}
