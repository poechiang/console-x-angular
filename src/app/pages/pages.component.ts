import { Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CxLayoutsModule } from '@com/layouts.module';

@Component({
  selector: 'cx-pages',
  exportAs: 'cxPages',
  imports: [CxLayoutsModule, RouterOutlet],
  template: `
    <cx-app-sider></cx-app-sider>

    <main class="flex-auto mh-24">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class CxPagesComponent {
  @HostBinding('class.flexable') flexable = true;
}
