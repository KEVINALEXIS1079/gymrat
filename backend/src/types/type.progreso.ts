
export type Progreso = {
    id_progreso: number,
    peso: number,
    estatura: number,
    foto_progreso: string,
    edad?: number,
    usuario_fk: number,
    fecha_progreso: Date,
    rutina_fk: number
};
