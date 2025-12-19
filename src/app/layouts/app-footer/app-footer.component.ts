import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cx-app-footer',
  exportAs: 'cxAppFooter',
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CxAppFooterComponent {
  now = new Date().getFullYear();
}
