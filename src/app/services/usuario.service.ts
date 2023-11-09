import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, getDocs, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { COLECCION } from '../models/constants/coleccion.constant';
import { Foto } from '../models/class/foto.class';
import { Paciente } from '../models/class/paciente.class';
import { Especialista } from '../models/class/especialista.class';
import { Administrador } from '../models/class/administrador.class';
import { Horarios } from '../models/class/horarios.class';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private colleccion: any;
  private colleccionRegistroIngreso: any;

  constructor( private firestore: Firestore ) {
    this.colleccion = collection(this.firestore, COLECCION.USUARIOS);
    this.colleccionRegistroIngreso = collection(this.firestore, COLECCION.REGISTRO_INGRESOS);
   }

  setFechaIngreso(correo: string) {
    const fecha = new Date().getTime();
    const documentoNuevo = doc(this.colleccionRegistroIngreso);
    return setDoc(documentoNuevo, {correo,fecha});
  }

  setPaciente(paciente: Paciente) {
    //? importante destructurara la foto
    paciente.fotos = paciente.fotos.map((foto:Foto) => { return { ...foto } });
    const documentoNuevo = doc(this.colleccion, paciente.id);
    return setDoc(documentoNuevo, {...paciente});
  }

  setEspecialista(especialista: Especialista) {
    //? importante destructurara la foto
    especialista.foto = {... especialista.foto}
    const documentoNuevo = doc(this.colleccion, especialista.id);
    return setDoc(documentoNuevo, {...especialista});
  }

  updateEspecialista(especialista: Especialista, id: string): Promise<void> {
    //? importante destructurara la foto
    especialista.foto = {... especialista.foto}
    //? importante destructurara los horarios
    especialista.horarios = especialista.horarios.map((horarios: Horarios) => { return { ...horarios } });
    const documento = doc(this.colleccion, id);
    return updateDoc(documento, {
      ...especialista,
    });
  }

  setAdministrador(administrador: Administrador) {
    //? importante destructurara la foto
    administrador.foto = {... administrador.foto}
    const documentoNuevo = doc(this.colleccion, administrador.id);
    return setDoc(documentoNuevo, {...administrador});
  }

  getUsuariosFiltrado(campo:string, valor: string) {
    const colleccionRef = collection(this.firestore, COLECCION.USUARIOS);
    const q = query(colleccionRef, where(campo, '==', valor));
    return collectionData(q, { idField: 'id' });
  }

  async getUsuarioAsync(campo:string, valor: string) {
    const q = query(this.colleccion, where(campo, '==', valor));
    const docs = await getDocs(q).then((docs) => {
      return docs;
    });

    const listaDeObjetos: Array<any> = [];
    docs.forEach((item) => {
      listaDeObjetos.push(item.data());
    });

    if(listaDeObjetos?.length == 1){
      return listaDeObjetos[0];
    }
    return null;
  }

  getUsuarios() {
    return collectionData(this.colleccion, { idField: 'id' });
  }

  eliminarUsuario(id:string){
    const documento = doc(this.colleccion, id);
    return deleteDoc(documento);
  }

  modificarUsuario(usuario:any){
    const documento = doc(this.colleccion, usuario.id);
    return updateDoc(documento, {
      ...usuario,
    });
  }

  getUsuariosOrdenados(campo:string, tipoOrdenamiento: 'asc' | 'desc') {
    const q = query(this.colleccion, orderBy(campo, tipoOrdenamiento));
    return collectionData(q);
  }

  getUsuariosOrdenadosYFiltrados(campo:string, tipoOrdenamiento: 'asc' | 'desc', campo1:string, valor1:string) {
    const q = query(this.colleccion,
      orderBy(campo, tipoOrdenamiento),
      where(campo1, '==', valor1),
      );
    return collectionData(q);
  }
}
