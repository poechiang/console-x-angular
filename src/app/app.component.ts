import { Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CxAppFooterComponent } from '@com/app-footer/app-footer.component';
import { CxAppHeaderComponent } from '@com/app-header/app-header.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@Component({
  selector: 'app-root',
  imports: [NzIconModule, NzLayoutModule, RouterOutlet, CxAppHeaderComponent, CxAppFooterComponent],
  template: ` <cx-app-header [style.margin-block-end.px]="24">
      <img src="logo.svg" alt="" srcset="" web-logo />
    </cx-app-header>
    <router-outlet></router-outlet>
    <cx-app-footer></cx-app-footer>`,
})
export class AppComponent {
  @HostBinding('attr.dev-mode') isDev = true;
}
