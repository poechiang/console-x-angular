import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { GlobalOutline, UserOutline } from '@ant-design/icons-angular/icons';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule, provideNzIconsPatch } from 'ng-zorro-antd/icon';
import { CxThemeSwitchComponent } from './theme-switch/theme-switch.component';

@Component({
  styles: `
    :host {
      display: flex;
      align-items: center;
      padding: 10px 24px;
      gap: 16px;
      .cx-app-header-clickable {
        padding: 5px;
        height: 44px;
        min-width: 44px;
      }
    }
  `,
  selector: 'cx-app-header',
  imports: [NzIconModule, NzButtonModule, CxThemeSwitchComponent],
  providers: [provideNzIconsPatch([UserOutline, GlobalOutline])],
  template: `
    <ng-content select="[web-logo]"></ng-content>
    <h1 class="mb-0">Console <sup [style.color]="'red'">X</sup></h1>
    <span class="flex-auto">
      <ng-content></ng-content>
    </span>
    <button nz-button class="cx-app-header-clickable" nzType="text">
      <nz-icon nzType="global" nzTheme="outline" />
    </button>
    <cx-theme-switch></cx-theme-switch>

    <button nz-button class="cx-app-header-clickable" nzType="text">
      <nz-icon nzType="user" nzTheme="outline" />
    </button>
  `,
  exportAs: 'cxAppHeader',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxAppHeaderComponent {
  @HostBinding('class.cx-app-header') _ = true;
}
