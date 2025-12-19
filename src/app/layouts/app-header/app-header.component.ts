import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@lib/Storage.class';
import { AuthService } from '@srv/auth.service';

@Component({
  selector: 'cx-app-header',
  exportAs: 'cxAppHeader',
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CxAppHeaderComponent implements OnInit {
  @HostBinding('class.cx-app-header') wrapper = true;
  #auth = inject(AuthService);
  #cdr = inject(ChangeDetectorRef);
  get currentUser() {
    return Storage.local<User>('me');
  }

  router = inject(Router);

  ngOnInit(): void {
    this.#auth.meChange.subscribe(() => {
      this.#cdr.markForCheck();
    });
  }
}
