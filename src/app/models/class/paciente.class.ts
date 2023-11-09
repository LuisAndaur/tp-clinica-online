import { EstadoUsuario } from "../types/estado-usuario.type";
import { Rol } from "../types/rol.type";
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
  estado: EstadoUsuario = 'aceptado';
  rol: Rol = 'paciente';
  fechaRegistro: number = new Date().getTime();
}
