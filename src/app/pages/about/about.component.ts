import { Component, HostBinding } from '@angular/core';
import { CxPageBodyComponent } from '@com/page-body/page-body.component';
import { CxPageHeaderComponent } from '@com/page-header/page-header.component';

@Component({
  selector: 'cx-about',
  exportAs: 'cxAbout',
  imports: [CxPageHeaderComponent, CxPageBodyComponent],
  template: `
    <cx-page-header cxTitle="About"></cx-page-header>
    <cx-page-body>
      <p>about works!</p>
    </cx-page-body>
  `,
})
export class CxAboutComponent {
  @HostBinding('class.cx-page-wrapper') pageWrapper = true;
}
