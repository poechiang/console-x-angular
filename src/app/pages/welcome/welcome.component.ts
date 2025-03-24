import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'cx-welcome',
  exportAs: 'cxWelcome',
  template: ` <h1>Welcome to the Angular Application!</h1> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxWelcomeComponent {
  @HostBinding('class.cx-page-wrapper') pageWrapper = true;
  constructor() {}
}
