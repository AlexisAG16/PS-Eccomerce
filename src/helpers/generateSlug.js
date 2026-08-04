export const generateSlug = (text) => {
  return text
    .toString()                               // Asegurar que es string
    .toLowerCase()                            // Todo a minúsculas
    .trim()                                   // Quitar espacios al inicio/final
    .normalize('NFD')                         // Separar letras de acentos
    .replace(/[\u0300-\u036f]/g, '')         // Borrar los acentos
    .replace(/\s+/g, '-')                     // Espacios por guiones
    .replace(/[^\w-]+/g, '')                  // Quitar caracteres especiales
    .replace(/--+/g, '-');                    // No permitir guiones dobles
};