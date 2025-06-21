export const validarExtensionImagen = (nombreArchivo: string): boolean => {
    const extensionesValidas = ['.jpg', '.jpeg', '.png', '.webp'];
    return extensionesValidas.some(ext => nombreArchivo.toLowerCase().endsWith(ext));
};
