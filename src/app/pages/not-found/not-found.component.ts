import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CxPageBodyComponent } from '@com/page-body/page-body.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'cx-not-found',
  exportAs: 'cxNotFound',
  imports: [NzButtonModule, NzResultModule, CxPageBodyComponent],
  template: `
    <cx-page-body [style.margin.px]="24">
      <nz-result nzStatus="404" nzTitle="404" nzSubTitle="对不起，您访问的页面不存在。">
        <div nz-result-extra>
          <button nz-button nzType="primary" (click)="goHome()">首页</button>
        </div>
      </nz-result>
    </cx-page-body>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxNotFoundComponent {
  #router = inject(Router);

  goHome() {
    this.#router.navigateByUrl('/overview/dashboard');
  }
}
