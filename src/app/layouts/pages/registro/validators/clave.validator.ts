import { ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

export function confirmarClaveValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const clave = formGroup.get('clave');
    const repiteClave = formGroup.get('repiteClave');
    const respuestaError = { noCoincide: 'La clave no coincide' };

    if (clave?.value !== repiteClave?.value) {
      repiteClave?.setErrors(respuestaError);
      return respuestaError;
    }
    repiteClave?.setErrors(null);
    return null;
  };
}
