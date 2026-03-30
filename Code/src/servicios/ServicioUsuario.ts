import { Ok, Err, Result } from 'ts-results';
import { RepositorioUsuario } from '../repositorio/RepositorioUsuario';
import { Usuario } from '../modelos/Usuario';
import { Huesped } from '../modelos/Huesped';
import { CrearUsuarioDTO } from '../dtos/Usuario/CrearUsuarioDTO';
import { AutenticarUsuarioDTO } from '../dtos/Usuario/AutenticarUsuarioDTO';

type ErrorUsuario =
  | 'USUARIO_NO_ENCONTRADO'
  | 'CORREO_DUPLICADO'
  | 'CREDENCIALES_INVALIDAS';

export class ServicioUsuario {
  async crear(dto: CrearUsuarioDTO): Promise<Result<Usuario, ErrorUsuario>> {
    const existe = await RepositorioUsuario.findByCorreo(dto.correo);
    
    if (existe) {
      return Err('CORREO_DUPLICADO');
    }

    const usuario = RepositorioUsuario.create({
      correo_auth: dto.correo,
      password: dto.password,
      rol: dto.rol,
    });

    if (dto.id_huesped) {
      usuario.huesped = { id: dto.id_huesped } as Huesped;
    }

    return Ok(await RepositorioUsuario.save(usuario));
  }

  async autenticar(
    dto: AutenticarUsuarioDTO,
  ): Promise<Result<Usuario, ErrorUsuario>> {
    const usuario = await RepositorioUsuario.findByCorreo(dto.correo);
    
    if (!usuario || usuario.password !== dto.password) {
      return Err('CREDENCIALES_INVALIDAS');
    }
    
    return Ok(usuario);
  }

  async buscarPorId(id: number): Promise<Result<Usuario, ErrorUsuario>> {
    const usuario = await RepositorioUsuario.findOneBy({ id });
    
    if (!usuario) {
      return Err('USUARIO_NO_ENCONTRADO');
    }
    
    return Ok(usuario);
  }

  async desactivar(id: number): Promise<Result<void, ErrorUsuario>> {
    const { affected } = await RepositorioUsuario.update(id, { activo: false });
    
    if (!affected) {
      return Err('USUARIO_NO_ENCONTRADO');
    }
    
    return Ok(undefined);
  }
}
