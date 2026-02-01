import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'error',
})
export class CxFormErrorPipe implements PipeTransform {
  transform(ctrl: AbstractControl, errorTip: CxFormSchema['errorTip'], key?: any, ...args: unknown[]): string | null {
    if (!errorTip) {
      return null;
    }

    if (ctrl.errors?.[key ?? 'error']) {
      return typeof errorTip === 'string' ? errorTip : errorTip?.[key ?? 'error'];
    } else {
      return null;
    }
  }
}
