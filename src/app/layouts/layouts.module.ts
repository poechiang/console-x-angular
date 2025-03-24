import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CxAppFooterComponent } from './app-footer/app-footer.component';
import { CxAppHeaderComponent } from './app-header/app-header.component';
import { CxAppSiderComponent } from './app-sider/app-sider.component';

const components = [CxAppHeaderComponent, CxAppSiderComponent, CxAppFooterComponent];
@NgModule({
  declarations: [],
  imports: [RouterModule, ...components],
  exports: [...components],
})
export class CxLayoutsModule {}
