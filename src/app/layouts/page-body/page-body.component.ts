import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'cx-page-body',
  exportAs: 'cxPageBody',
  template: ` <ng-content></ng-content> `,
})
export class CxPageBodyComponent {
  @HostBinding('style.display') display = 'block';
  @HostBinding('style.padding.px') padding = 24;
  @HostBinding('style.border-radius.px') radius = 16;
  @HostBinding('class.ghost') @Input('cxGhost') ghost?: boolean = false;
  @HostBinding('style.background-color') backgroundColor = this.ghost ? null : '#ffffff';
}
