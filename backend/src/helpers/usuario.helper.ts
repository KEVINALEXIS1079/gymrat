// helpers/usuario.helper.ts
import { pool } from '../data/conexion.data'
import { Usuario } from '../types/type.usuario'; 

export const verificarUsuarioPorId = async (id_usuario: number): Promise<boolean> => {
    const resultado = await pool.query('SELECT * FROM usuario WHERE id_usuario = $1', [id_usuario])
    return resultado.rows.length > 0
}

// validacion de los datos del usuario
export const validarCorreo = (correo: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
};

export const validarUsuario = (usuario: Usuario): { valido: boolean, errores: string[] } => {
    const errores: string[] = [];

    if (!validarCorreo(usuario.gmail)) {
        errores.push("El formato del correo es inválido debe contener '@' y un dominio");
    }

    if (!usuario.apellido_usuario || usuario.apellido_usuario.trim() === "") {
        errores.push("El apellido es obligatorio");
    }

    if (!usuario.genero || !["masculino", "femenino", "tranformers"].includes(usuario.genero)) {
        errores.push("Género inválido");
    }

    return {
        valido: errores.length === 0,
        errores
    };
};
