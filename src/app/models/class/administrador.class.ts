import { estadoUsuario } from "../types/estado-usuario.type";
import { rol } from "../types/rol.type";
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
  estado: estadoUsuario = 'aceptado';
  rol: rol = 'administrador';
  fechaRegistro: number = new Date().getTime();
}
