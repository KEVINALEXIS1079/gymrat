import { pool } from '../data/conexion.data'
import { Progreso } from '../types/type.progreso'; 

export const verificarProgresoPorId = async (id_progreso: number): Promise<boolean> => {
    const resultado = await pool.query('SELECT * FROM progreso WHERE id_progreso = $1', [id_progreso]);
    return resultado.rows.length > 0;
};

export const validarProgreso = (progreso: Progreso): { valido: boolean, errores: string[] } => {
    const errores: string[] = [];

    if (!progreso.id_progreso || progreso.id_progreso === 0) {
        errores.push("El ID del progreso es obligatorio");
    }
    if (!progreso.peso || progreso.peso <= 0) {
        errores.push("El peso es obligatorio y debe ser mayor a 0");
    }

    if (!progreso.estatura || progreso.estatura <= 0) {
        errores.push("La estatura es obligatoria y debe ser mayor a 0");
    }

    if (!progreso.edad || progreso.edad <= 0) {
        errores.push("La edad es obligatoria y debe ser mayor a 0");
    }

    if (!progreso.foto_progreso || progreso.foto_progreso.trim() === "") {
        errores.push("La foto de progreso es obligatoria");
    }

    if (!progreso.usuario_fk || progreso.usuario_fk === 0) {
        errores.push("El ID del usuario es obligatorio");
    }

    if (!progreso.fecha_progreso || isNaN(new Date(progreso.fecha_progreso).getTime())) {
        errores.push("La fecha es obligatoria y debe ser una fecha válida");
    }
    if (!progreso.rutina_fk || progreso.rutina_fk === 0) {
        errores.push("El ID de la rutina es obligatorio");
    }

    return {
        valido: errores.length === 0,
        errores
    };
};