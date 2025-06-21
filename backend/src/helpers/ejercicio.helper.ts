import { pool } from '../data/conexion.data';
import { Ejercicio } from '../types/type.ejercicio'; 

export const verificarEjercicioPorId = async (id_ejercicio: number): Promise<boolean> => {
    const resultado = await pool.query('SELECT * FROM ejercicio WHERE id_ejercicio = $1', [id_ejercicio])
    return resultado.rows.length > 0
}

export const validarEjercicio = (ejercicio: Ejercicio): { valido: boolean, errores: string[] } => {
    const errores: string[] = [];

    if (!ejercicio.nombre_ejercicio || ejercicio.nombre_ejercicio.trim() === "") {
        errores.push("El nombre del ejercicio es obligatorio");
    }

    if (!ejercicio.descripcion || ejercicio.descripcion.trim() === "") {
        errores.push("La descripción del ejercicio es obligatoria");
    }

    if (!ejercicio.zona_muscular || (ejercicio.zona_muscular.trim() !== "pecho" && ejercicio.zona_muscular.trim() !== "espalda" && ejercicio.zona_muscular.trim() !== "pierna" && ejercicio.zona_muscular.trim() !== "Brazos" && ejercicio.zona_muscular.trim() !== "hombros")) {
        errores.push("La zona muscular es obligatoria");
    }

    if (!ejercicio.foto_ejercicio || ejercicio.foto_ejercicio.trim() === "") {
        errores.push("La foto del ejercicio es obligatoria");
    }

    return {
        valido: errores.length === 0,
        errores
    };
};
