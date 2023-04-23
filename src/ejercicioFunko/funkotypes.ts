/**
 * Tipo *FunkoPop* que representa un funko.
 */
export type FunkoPop = {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  genero: string;
  franquicia: string;
  numero: number;
  exclusivo: boolean;
  caracteristicas_especiales: string;
  valor_mercado: number;
}

/**
 * Tipo *ResponseType* que representa una respuesta.
 */
export type ResponseType = {
  success: boolean;
  funkoPops?: FunkoPop[] | FunkoPop;
}