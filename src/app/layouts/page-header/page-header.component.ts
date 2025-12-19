import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'cx-page-header',
  exportAs: 'cxPageHeader',
  imports: [NzIconModule, NzButtonModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxPageHeaderComponent {
  @Input('cxTitle') title = 'Page Header';
  @Input('cxTitleIcon') titleIcon = 'left';
  @Input('cxTitleIconTheme') titleIconTheme = 'outline';
}
