import { RepositorioConfiguracion } from '../repositorio/RepositorioConfiguracion';

export class ServicioConfiguracion {
  getLateCheckoutHoraLimite(): Promise<string> {
    return RepositorioConfiguracion.getTexto(
      'late_checkout_hora_limite',
      '12:00',
    );
  }
}
