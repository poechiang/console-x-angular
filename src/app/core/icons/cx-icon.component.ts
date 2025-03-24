import { Component, HostBinding, Input } from '@angular/core';

@Component({
  template: '',
})
class CxBaseOutlineIconComponent {
  @HostBinding('class.cx-icon-wrapper') wrapper = true;
  @HostBinding('style.width.em') width = 1.3;
  @HostBinding('style.height.em') height = 1.3;
}
@Component({
  standalone: true,
  selector: 'cx-home-icon',
  templateUrl: './home-outline.svg',
})
export class CxHomeOutlineIcon extends CxBaseOutlineIconComponent {}

@Component({
  standalone: true,
  selector: 'cx-overview-icon',
  templateUrl: './overview-outline.svg',
})
export class CxOverviewOutlineIcon extends CxBaseOutlineIconComponent {}

@Component({
  standalone: true,
  selector: 'cx-about-icon',
  templateUrl: './about-outline.svg',
})
export class CxAboutOutlineIcon extends CxBaseOutlineIconComponent {}

@Component({
  standalone: true,
  imports: [CxHomeOutlineIcon, CxOverviewOutlineIcon, CxAboutOutlineIcon],
  selector: 'cx-icon',
  template: `
    @if (icon === 'home') {
      <cx-home-icon></cx-home-icon>
    } @else if (icon === 'overview') {
      <cx-overview-icon></cx-overview-icon>
    } @else if (icon === 'about') {
      <cx-about-icon></cx-about-icon>
    }
  `,
})
export class CxIcon {
  @Input({ required: true }) icon?: 'home' | 'overview' | 'about';
}
