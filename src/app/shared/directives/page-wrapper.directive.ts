import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[cx-page-wrapper]',
})
export class CxPageWrapperDirective {
  @HostBinding('style.gap.px') gap = 24;
  @HostBinding('style.display') display = 'flex';
  // main {
  //   display: flex;
  //   gap: 24px;
  //   padding: 24px;
  // }
  constructor() {}
}
