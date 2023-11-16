import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, concat, defer, forkJoin, ignoreElements } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { TransformService } from './transform.service';

@Injectable({
  providedIn: 'root'
})
export class FirestorageService {

  constructor(
    private storage: AngularFireStorage,
    private transform: TransformService
    ) { }


  guardarArchivo(archivo: File, carpeta: string): Observable<string> {

    const fecha = this.transform.fechaToString(new Date(), true , true);
    const nombreDelArchivo = `${carpeta}${fecha}__${uuidv4()}__${archivo.name}`;

    const fileRef = this.storage.ref(nombreDelArchivo);
    const task = this.storage.upload(nombreDelArchivo, archivo);

    return concat(
      task.snapshotChanges().pipe(ignoreElements()),
      defer(() => fileRef.getDownloadURL())
    );
  }

  guardarArchivos(archivos: Array<File>, carpeta: string) : Observable<Array<string>> {
    const observableArchivos = archivos.map(archivo => this.guardarArchivo(archivo, carpeta));
    return forkJoin(observableArchivos);
  }

  obtenerArchivoPorURL(url: string) {
    return this.storage.storage.refFromURL(url);
  }
}
