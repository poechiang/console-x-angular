import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      h3 {
        margin: 0;
      }
    }
  `,
  selector: 'cx-page-header',
  exportAs: 'cxPageHeader',
  imports: [NzIconModule, NzButtonModule],
  template: `<button nz-button nzType="text"><nz-icon nzType="left" nzTheme="outline" /></button>
    <h3>{{ title }}</h3>
    <ng-content></ng-content>
    <ng-content select="[cxExtra]"></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxPageHeaderComponent {
  @Input('cxTitle') title = 'Page Header'; // Default title if not provided
  @Input('cxTitleIcon') titleIcon = 'left'; // Default icon if not provided
  @Input('cxTitleIconTheme') titleIconTheme = 'outline'; // Default icon theme if not provided
}
