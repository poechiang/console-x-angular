import { Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CxLayoutsModule } from '@com/layouts.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@Component({
  selector: 'app-root',
  imports: [NzIconModule, NzLayoutModule, CxLayoutsModule, RouterOutlet],
  template: ` <cx-app-header [style.margin-block-end.px]="24">
      <img src="logo.svg" alt="" srcset="" web-logo />
    </cx-app-header>
    <router-outlet></router-outlet>
    <cx-app-footer></cx-app-footer>`,
})
export class AppComponent {
  @HostBinding('attr.dev-mode') isDev = true;
}
