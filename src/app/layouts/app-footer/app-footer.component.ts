import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cx-app-footer',
  exportAs: 'cxAppFooter',
  template: ` <p>版权所有&copy;Boboo {{ now }}</p> `,
  styles: `
    :host {
      display: block;
      padding: 16px;
      text-align: center;
      color: #9a9a9a;
      font-size: 12px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxAppFooterComponent {
  now = new Date().getFullYear();
}
