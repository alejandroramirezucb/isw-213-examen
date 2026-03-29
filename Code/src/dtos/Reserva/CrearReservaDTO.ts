export interface CrearReservaDTO {
  id_habitacion: number;
  id_huesped_titular: number;
  fecha_checkin: string;  
  fecha_checkout: string; 
  cantidad_personas: number;
  notas?: string;
}
