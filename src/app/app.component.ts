import { Component, HostBinding, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CxAppFooterComponent } from '@com/app-footer/app-footer.component';
import { CxAppHeaderComponent } from '@com/app-header/app-header.component';
import { CxAppSiderComponent } from '@com/app-sider/app-sider.component';
import { LayoutsService } from '@com/layouts.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@Component({
  selector: 'app-root',
  imports: [NzIconModule, NzLayoutModule, CxAppHeaderComponent, CxAppSiderComponent, RouterOutlet, CxAppFooterComponent],
  template: ` @if (layout.header.visible) {
      <cx-app-header [style.margin-block-end.px]="24">
        <img src="logo.svg" alt="" srcset="" web-logo />
      </cx-app-header>
    }
    <div class="flexable">
      @if (layout.sider.visible) {
        <cx-app-sider></cx-app-sider>
      }
      <main class="flex-auto mh-24">
        <router-outlet></router-outlet>
      </main>
    </div>
    @if (layout.footer.visible) {
      <cx-app-footer></cx-app-footer>
    }`,
})
export class AppComponent implements OnInit {
  @HostBinding('attr.dev-mode') isDev = true;

  constructor(public layout: LayoutsService) {}
  ngOnInit() {}
}
