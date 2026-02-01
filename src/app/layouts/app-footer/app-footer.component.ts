import { Component } from '@angular/core';

@Component({
  selector: 'cx-app-footer',
  exportAs: 'cxAppFooter',
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.less',
})
export class CxAppFooterComponent {
  now = new Date().getFullYear();
}
