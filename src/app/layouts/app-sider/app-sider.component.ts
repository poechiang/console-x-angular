import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MenuService, NzMenuDirective, NzMenuItemComponent, NzSubMenuComponent } from 'ng-zorro-antd/menu';
import { filter } from 'rxjs';
import { CxIcon } from 'src/app/core/icons/cx-icon.component';
import { MenuItem, menuList } from './menus';

@Component({
  styles: `
    :host {
      display: contents;
      .main-menu {
        width: 268px;
      }
    }
  `,
  selector: 'cx-app-sider',
  exportAs: 'cxAppSider',
  imports: [NgTemplateOutlet, NzIconModule, NzMenuDirective, NzSubMenuComponent, NzMenuItemComponent, RouterModule, CxIcon],
  providers: [MenuService],
  template: `
    <ul class="main-menu" nz-menu nzMode="inline" [nzInlineCollapsed]="isCollapsed">
      <ng-container *ngTemplateOutlet="menuItemTpl; context: { $implicit: menuList }"></ng-container>

      <ng-template #menuItemTpl let-menus>
        @for (menu of menus; track menu) {
          @if (!menu.children) {
            <li
              nz-menu-item
              [nzPaddingLeft]="menu.level * 24"
              [nzDisabled]="menu.disabled"
              [nzSelected]="menu.selected"
              [routerLink]="menu.link"
              [routerLinkActive]="['active']"
              [routerLinkActiveOptions]="{ exact: true }"
              [nzMatchRouter]="menu.matchRouter"
            >
              <ng-container *ngTemplateOutlet="menuTitleTpl"></ng-container>
            </li>
          } @else {
            <li
              nz-submenu
              [nzPaddingLeft]="menu.level * 24"
              [nzTitle]="menuTitleTpl"
              [nzOpen]="menu.open"
              [routerLink]="menu.link"
              [nzDisabled]="menu.disabled"
            >
              <ul>
                <ng-container *ngTemplateOutlet="menuItemTpl; context: { $implicit: menu.children }" />
              </ul>
            </li>
          }

          <ng-template #menuTitleTpl>
            <cx-icon [icon]="menu.icon" [class.mr-8]="true"></cx-icon>
            {{ menu.title }}
          </ng-template>
        }
      </ng-template>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxAppSiderComponent implements OnInit {
  isCollapsed = false;
  menuList: MenuItem[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.listenRouterEvents();
    this.menuList = this.initMenuList(menuList) ?? [];
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
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(e => {
      this.calcMenuState(this.menuList, e.url);
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
