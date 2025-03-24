import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'cx-page-body',
  exportAs: 'cxPageBody',
  standalone: true,
  imports: [],
  template: ` <ng-content></ng-content> `,
  styles: `
    :host {
      display: block;
      padding: 16px;

      &:not(.ghost) {
        background: #ffffff;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxPageBodyComponent {
  @HostBinding('style.border-radius.px') radius = 6;
  @HostBinding('class.ghost') @Input('cxGhost') ghost?: boolean = false;
  constructor() {
    console.log('page-body works!');
  }
  ngOnInit() {
    console.log('page-body ngOnInit');
  }
  ngOnDestroy() {
    console.log('page-body ngOnDestroy');
  }
  ngOnChanges() {
    console.log('page-body ngOnChanges');
  }
}
