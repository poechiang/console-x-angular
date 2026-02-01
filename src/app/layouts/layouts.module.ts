import { NgTemplateOutlet } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MenuService, NzMenuDirective, NzMenuItemComponent, NzSubMenuComponent } from 'ng-zorro-antd/menu';
import { CxIcon } from '../core/icons/cx-icon.component';
import { CxAppFooterComponent } from './app-footer/app-footer.component';
import { CxAppHeaderComponent } from './app-header/app-header.component';
import { CxThemeSwitchComponent } from './app-header/theme-switch/theme-switch.component';
import { CxAppSiderComponent } from './app-sider/app-sider.component';

const components = [CxAppHeaderComponent, CxThemeSwitchComponent, CxAppSiderComponent, CxAppFooterComponent];
@NgModule({
  declarations: [...components],
  imports: [
    RouterModule,
    NzIconModule,
    NzButtonModule,
    NgTemplateOutlet,
    NzIconModule,
    NzMenuDirective,
    NzSubMenuComponent,
    NzMenuItemComponent,
    NzDropdownModule,
    NzIconModule,
    NzAvatarModule,
    RouterModule,
    TranslateModule,

    CxIcon,
  ],
  providers: [MenuService],
  exports: [...components],
})
export class CxLayoutsModule {}
