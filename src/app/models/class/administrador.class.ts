import { EstadoUsuario } from "../types/estado-usuario.type";
import { Rol } from "../types/rol.type";
import { Foto } from "./foto.class";

export class Administrador {
  id: string = "";
  nombre!: string;
  apellido!: string;
  edad!: number;
  dni!: number;
  correo!: string;
  clave!: string;
  foto!: Foto;
  estado: EstadoUsuario = 'aceptado';
  rol: Rol = 'administrador';
  fechaRegistro: number = new Date().getTime();
}
