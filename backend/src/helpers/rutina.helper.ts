import { pool } from '../data/conexion.data';
import { Rutina } from '../types/type.rutina'; 

export const verificarRutinaPorId = async (id_rutina: number): Promise<boolean> => {
    const resultado = await pool.query('SELECT * FROM rutina WHERE id_rutina = $1', [id_rutina]);
    return resultado.rows.length > 0;
};

export const validarRutina = (rutina: Rutina): { valido: boolean, errores: string[] } => {
    const errores: string[] = [];

    if (!rutina.id_rutina || rutina.id_rutina === 0) {
        errores.push("El ID de la rutina es obligatorio");
    }
    if (!rutina.tiempo_rutina || rutina.tiempo_rutina <= 0) {
        errores.push("El tiempo de la rutina es obligatorio y debe ser mayor a 0");
    }

    if (!rutina.fecha_inicio || isNaN(new Date(rutina.fecha_inicio).getTime())) {
        errores.push("La fecha de inicio es obligatoria y debe ser una fecha válida");
    }

    if (!rutina.fecha_fin || isNaN(new Date(rutina.fecha_fin).getTime())) {
        errores.push("La fecha de fin es obligatoria y debe ser una fecha válida");
    }
    
    if (!rutina.descripcion || rutina.descripcion.trim() === "") {
        errores.push("La descripción de la rutina es obligatoria");
    }

    return {
        valido: errores.length === 0,
        errores
    };
};