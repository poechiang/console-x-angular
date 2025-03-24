import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Component({
  styles: `
    :host {
      cursor: pointer;
      background-color: #0000001f;
      border-radius: 13px;
      position: relative;
      border: 1px solid transparent;
      box-shadow: unset;

      .bullet {
        position: absolute;
        box-sizing: border-box;
        border-radius: 50%;
        transition:
          left 0.2s 0.1s ease-in-out,
          opacity 0.2s 0.1s ease-in-out;
        top: 2px;
        opacity: 0;

        &.sun {
          background: linear-gradient(40deg, #ff0080, #ff8c00 70%);
          box-shadow: 0 0 5px #ff0080;
          filter: none;
          opacity: 1;
        }

        &.moon {
          background: transparent;
          box-shadow:
            inset -3px -3px 5px -2px #8983f7,
            inset -4px -4px 0px 0px #a3daff;
          filter: drop-shadow(0 0 2px #8983f7);
        }
      }

      &:not(.disabled).checked {
        .bullet.sun {
          opacity: 0;
        }
        .bullet.moon {
          opacity: 1;
        }
      }

      &.disabled {
        filter: grayscale(1);
        cursor: not-allowed;
      }
    }
  `,
  selector: 'cx-theme-switch',
  exportAs: 'cxThemeSwitch',
  imports: [],
  template: `
    <span
      class="bullet sun"
      [style.width.px]="height - 6"
      [style.height.px]="height - 6"
      [style.left.px]="checked ? height + 2 : 2"
    ></span>
    <span
      class="bullet moon"
      [style.width.px]="height - 6"
      [style.height.px]="height - 6"
      [style.left.px]="checked ? height + 2 : 2"
    ></span>
  `,
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
