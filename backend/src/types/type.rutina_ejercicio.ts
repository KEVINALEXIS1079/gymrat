export type RutinaEjercicio = {
    id_rutina_ejercicio: number,
    rutina_fk: number,
    ejercicio_fk: number,
    series: number,
    repeticiones: number,
    peso: number,
    descripcion: string
};