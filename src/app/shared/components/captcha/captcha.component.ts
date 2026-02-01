import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { HttpsService } from '@srv/https.service';

@Component({
  selector: 'cx-captcha',
  exportAs: 'cxCaptch',
  templateUrl: './captcha.component.html',
  styleUrl: './captcha.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxCaptchaComponent implements OnDestroy {
  #url?: string;
  @Input('cxUrl') get url() {
    return this.#url;
  }
  set url(value) {
    if (this.#url !== value) {
      this.#url = value;
      if (value) {
        this.refresh();
      }
    }
  }

  @Output() onCodeChange = new EventEmitter<{ code: string; type: 'refresh' | 'expire' | 'clear' }>();
  @HostBinding('class.captcha-wrapper') wrapper = true;
  @HostBinding('class.expired') expired = false;
  captchaImage = '';
  captchaCode = '';

  #https = inject(HttpsService);
  #cdr = inject(ChangeDetectorRef);
  #timeoutId?: number;
  async getCaptcha(e?: MouseEvent) {
    const { image, code, expire } = (await this.#https.get('auth/captcha', { theme: 'light', length: 4 })) ?? {};
    this.captchaCode = code;
    this.captchaImage = image;
    this.#cdr.detectChanges();

    if (this.#timeoutId) {
      clearTimeout(this.#timeoutId);
      this.#timeoutId = 0;
    }

    if (expire) {
      this.#timeoutId = setTimeout(() => {
        this.expired = true;
        this.onCodeChange.emit({ code: this.captchaCode, type: 'expire' });
        this.#cdr.markForCheck();
      }, expire);
    }
    this.onCodeChange.emit({ code, type: 'refresh' });
  }
  @HostListener('click') refresh(e?: MouseEvent) {
    this.expired = false;
    this.#cdr.markForCheck(); // 不能使用this.#cdr.detectChanges()
    this.getCaptcha();
  }

  ngOnDestroy(): void {
    clearTimeout(this.#timeoutId);
    this.#timeoutId = 0;
  }
}
