import { ElementRef, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lf2br',
})
export class CxLf2brPipe implements PipeTransform {
  constructor(private hostRef: ElementRef) {}
  transform(value: string, ...args: unknown[]): string {
    return value.replace(/\n/g, '<br>');
  }
}
