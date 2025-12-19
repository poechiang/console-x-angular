import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plh',
  standalone: false,
})
export class CxFormPlhPipe implements PipeTransform {
  transform(value: CxFormSchema, showLabel?: boolean, ...args: unknown[]): string {
    if (value.placeholder) {
      return value.placeholder;
    } else {
      const plh = value.label;
      if (showLabel) {
        return `请输入${plh}`;
      } else {
        return `${plh}${value.required ? '' : '（选填）'}`;
      }
    }
  }
}
