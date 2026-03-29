import { TipoDocumento } from '../../modelos/Huesped';

export interface CrearHuespedDTO {
  tipo_documento: TipoDocumento;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono?: string;
}
