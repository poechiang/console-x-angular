import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'cx-theme-switch',
  exportAs: 'cxThemeSwitch',
  templateUrl: './theme-switch.component.html',
  styleUrl: './theme-switch.component.less',
})
export class CxThemeSwitchComponent {
  @Input('cxForeColor') foreColor = '#353535';
  @HostBinding('class.checked') @Input('cxChecked') checked = false;
  @HostBinding('class.disabled') @Input('cxDisabled') disabled = false;
  @HostBinding('style.height.px') @Input('cxHeight') height = 26;
  @HostBinding('style.width.px') get width() {
    return this.height * 2;
  }
  @HostBinding('style.border-radius.px') get borderRadius() {
    return this.height / 2;
  }
  @Output('cxCheckedChange') checkedChange = new EventEmitter<boolean>();

  @HostListener('click') handleClick() {
    if (this.disabled) {
      return;
    }
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}
