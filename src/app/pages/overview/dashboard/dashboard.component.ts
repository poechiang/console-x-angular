import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CxPageBodyComponent } from '@com/page-body/page-body.component';
import { CxPageHeaderComponent } from '@com/page-header/page-header.component';

@Component({
  selector: 'cx-dashboard',
  exportAs: 'cxDashboard',
  imports: [CxPageHeaderComponent, CxPageBodyComponent],
  template: `
    <cx-page-header cxTitle="大屏"></cx-page-header>
    <cx-page-body>
      <p>about works!</p>
    </cx-page-body>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxDashboardComponent {}
