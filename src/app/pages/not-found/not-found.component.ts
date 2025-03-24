import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cx-not-found',
  exportAs: 'cxNotFound',
  template: ` <p>not-found works!</p> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxNotFoundComponent {}
