import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding } from '@angular/core';
import { CxPageBodyComponent } from '@com/page-body/page-body.component';
import { CxPageHeaderComponent } from '@com/page-header/page-header.component';

@Component({
  selector: 'cx-about',
  exportAs: 'cxAbout',
  imports: [CxPageHeaderComponent, CxPageBodyComponent],
  template: `
    <cx-page-header [cxTitle]="title"></cx-page-header>
    <cx-page-body>
      <p>about works!</p>
    </cx-page-body>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxAboutComponent {
  @HostBinding('class.cx-page-wrapper') pageWrapper = true;
  title: string = '';
  constructor(private cdr: ChangeDetectorRef) {
    console.log('about works!');
    setTimeout(() => {
      this.title = '关于我们';
      this.cdr.detectChanges();
    }, 3000);
  }
}
