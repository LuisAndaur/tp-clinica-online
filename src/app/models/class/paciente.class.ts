import { estadoUsuario } from "../types/estado-usuario.type";
import { rol } from "../types/rol.type";
import { Foto } from "./foto.class";

export class Paciente {
  id: string = "";
  nombre!: string;
  apellido!: string;
  edad!: number;
  dni!: number;
  obraSocial!: string;
  correo!: string;
  clave!: string;
  fotos: Array<Foto> = [];
  estado: estadoUsuario = 'aceptado';
  rol: rol = 'paciente';
  fechaRegistro: number = new Date().getTime();
}
