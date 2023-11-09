import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }

  success(text: string){
    Swal.fire({
      // position: 'top-end',
      icon: 'success',
      title: "Éxito!",
      text: text,
      showConfirmButton: false,
      timer: 1500
    })
  }

  error(text: string){
    Swal.fire({
      // position: 'top-end',
      icon: 'error',
      title: "Oops...",
      text: text,
      showConfirmButton: false,
      timer: 1500
    })
  }

  warning(text: string){
    Swal.fire({
      // position: 'top-end',
      icon: 'warning',
      title: '¡Atención!',
      text: text,
      showConfirmButton: false,
      timer: 1500
    })
  }

  info(text: string){
    Swal.fire({
      // position: 'top-end',
      icon: 'info',
      title: 'Info!',
      text: text,
      showConfirmButton: false,
      timer: 1500
    })
  }

  question(item: string){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Está seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Borrado!',
          `${item} ha sido eliminado.`,
          'success'
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          `${item} está a salvo :)`,
          'error'
        )
      }
    })
  }
}
