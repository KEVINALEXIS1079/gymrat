import { pool } from '../data/conexion.data'
import { RutinaEjercicio } from '../types/type.rutina_ejercicio'; 

export const verificarRutinaEjercicioPorId = async (id_rutina_ejercicio: number): Promise<boolean> => {
    const resultado = await pool.query('SELECT * FROM rutina_ejercicios WHERE id = $1', [id_rutina_ejercicio]);
    return resultado.rows.length > 0;
};

export const validarRutinaEjercicio = (rutinaEjercicio: RutinaEjercicio): { valido: boolean, errores: string[] } => {
    const errores: string[] = [];

    if (!rutinaEjercicio.id_rutina_ejercicio || rutinaEjercicio.id_rutina_ejercicio === 0) {
        errores.push("El ID de la rutina de ejercicio es obligatorio");
    }
    if (!rutinaEjercicio.rutina_fk || rutinaEjercicio.rutina_fk === 0) {
        errores.push("El ID de la rutina es obligatorio");
    }
    if (!rutinaEjercicio.ejercicio_fk || rutinaEjercicio.ejercicio_fk === 0) {
        errores.push("El ID del ejercicio es obligatorio");
    }
    if (!rutinaEjercicio.series || rutinaEjercicio.series <= 0) {
        errores.push("Las series son obligatorias y deben ser mayores a 0");
    }
    if (!rutinaEjercicio.repeticiones || rutinaEjercicio.repeticiones <= 0) {
        errores.push("Las repeticiones son obligatorias y deben ser mayores a 0");
    }
    if (!rutinaEjercicio.peso || rutinaEjercicio.peso < 0) {
        errores.push("El peso es obligatorio y debe ser mayor o igual a 0");
    }
    if (!rutinaEjercicio.descripcion || rutinaEjercicio.descripcion.trim() === "") {
        errores.push("La descripción es obligatoria");
    }

    return {
        valido: errores.length === 0,
        errores
    };
};