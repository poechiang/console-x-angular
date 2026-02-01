import { NgTemplateOutlet } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuDirective, NzMenuItemComponent, NzSubMenuComponent } from 'ng-zorro-antd/menu';
import { filter, Subject, takeUntil } from 'rxjs';
import { CxIcon } from 'src/app/core/icons/cx-icon.component';
import { MenuItem, menuList } from './menus';

@Component({
  selector: 'cx-app-sider',
  exportAs: 'cxAppSider',
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
  templateUrl: './app-sider.component.html',
  styleUrl: './app-sider.component.less',
})
export class CxAppSiderComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  menuList: MenuItem[] = [];

  private destroy$ = new Subject<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.listenRouterEvents();
    this.menuList = this.initMenuList(menuList) ?? [];
    this.calcMenuState(this.menuList, this.router.url);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initMenuList(menuList: MenuItem[], link?: string, level?: number): MenuItem[] | undefined {
    return menuList?.map(menu => {
      const fullLink = `${link ?? ''}/${menu.link}`;
      const currentLevel = level ? level + 1 : 1;
      return {
        ...menu,
        link: fullLink,
        level: currentLevel,
        children: menu.children ? this.initMenuList(menu.children, fullLink, currentLevel) : undefined,
      };
    });
  }

  private listenRouterEvents() {
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter(e => e instanceof NavigationEnd),
      )
      .subscribe(e => {
        this.calcMenuState(this.menuList, e.urlAfterRedirects);
      });
  }
  private calcMenuState(menus: any[], url: string) {
    let selected = false;
    menus.forEach(menu => {
      if (!menu.children) {
        menu.selected = menu.link ? url.includes(menu.link) : false;
        if (menu.selected) {
          selected = true;
        }
      } else {
        selected = this.calcMenuState(menu.children, url);
        menu.open = selected;
      }
    });
    return selected;
  }
}
