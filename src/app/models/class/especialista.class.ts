import { EstadoUsuario } from "../types/estado-usuario.type";
import { Rol } from "../types/rol.type";
import { Especialidad } from "./especialidad.class";
import { Foto } from "./foto.class";
import { Horarios } from "./horarios.class";

export class Especialista {
  id: string = "";
  nombre!: string;
  apellido!: string;
  edad!: number;
  dni!: number;
  especialidades!: Array<Especialidad>;
  correo!: string;
  clave!: string;
  foto!: Foto;
  estado: EstadoUsuario = 'pendiente';
  rol: Rol = 'especialista';
  fechaRegistro: number = new Date().getTime();
  horarios: Array<Horarios> = [];
}
