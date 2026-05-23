export type Reserva = {
  id: number;
  fecha_checkin: string;
  fecha_checkout: string;
  cantidad_personas: number;
  estado: string;
  notas?: string | null;
  habitacion?: { id: number; numero_habitacion: string };
};

export function ordenarPorFechaIngreso(reservas: Reserva[]): Reserva[] {
  if (!reservas || reservas.length === 0) {
    return [];
  }

  return [...reservas].sort(
    (a, b) => new Date(a.fecha_checkin).getTime() - new Date(b.fecha_checkin).getTime()
  );
}
