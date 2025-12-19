import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'width',
  standalone: false,
})
export class CxFormWidthPipe implements PipeTransform {
  transform(value: CxFormSchema, ...args: unknown[]): unknown {
    if (value.style?.width) {
      return `${value.style.width}px`;
    } else if (value.maxLength) {
      return `${value.maxLength * 0.75}em`;
    } else {
      return null;
    }
  }
}
