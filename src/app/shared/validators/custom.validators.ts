import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  // DRY: validadores reutilizables en cualquier formulario
  static positiveNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = parseFloat(control.value);
      return isNaN(value) || value <= 0 ? { positiveNumber: true } : null;
    };
  }

  static maxDecimals(decimals: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const regex = new RegExp(`^\\d+(\\.\\d{0,${decimals}})?$`);
      return control.value && !regex.test(control.value)
        ? { maxDecimals: { expected: decimals } }
        : null;
    };
  }

  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (!value) return null;
      const hasUpper = /[A-Z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasMinLength = value.length >= 8;
      return hasUpper && hasNumber && hasMinLength
        ? null
        : { strongPassword: { hasUpper, hasNumber, hasMinLength } };
    };
  }
}