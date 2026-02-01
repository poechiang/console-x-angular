import { ChangeDetectorRef, Component, HostBinding, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@srv/auth.service';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuDirective, NzMenuItemComponent } from 'ng-zorro-antd/menu';
import { CxThemeSwitchComponent } from './theme-switch/theme-switch.component';

@Component({
  selector: 'cx-app-header',
  exportAs: 'cxAppHeader',
  imports: [
    RouterModule,
    NzIconModule,
    NzButtonModule,
    NzIconModule,
    NzMenuDirective,
    NzMenuItemComponent,
    NzDropdownModule,
    NzIconModule,
    NzAvatarModule,
    RouterModule,
    TranslateModule,
    CxThemeSwitchComponent,
  ],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.less',
})
export class CxAppHeaderComponent implements OnInit {
  @HostBinding('class.cx-app-header') wrapper = true;
  auth = inject(AuthService);
  #cdr = inject(ChangeDetectorRef);

  router = inject(Router);

  ngOnInit(): void {
    // this.#auth.meChange.subscribe(() => {
    //   this.#cdr.markForCheck();
    // });
  }
}
