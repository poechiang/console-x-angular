import { ChangeDetectionStrategy, Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CxCaptchaComponent } from '@com/captcha/captcha.component';
import { CxFormModule } from '@com/form/form.module';
import { CxPageBodyComponent } from '@com/page-body/page-body.component';
import { Name20, Password16 } from '@const/regexp';
import { AuthService } from '@srv/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'cx-login',
  exportAs: 'cxLogin',
  imports: [
    CxPageBodyComponent,
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzSpaceModule,
    NzIconModule,
    NzTooltipModule,
    CxFormModule,
    NzQRCodeModule,
    CxCaptchaComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxLoginComponent implements OnInit {
  @ViewChild('captchaTpl', { static: true }) captchaTpl: TemplateRef;
  formSchema: CxFormSchema[] = [
    {
      name: 'userName',
      required: true,
      maxLength: 20,
      minLength: 4,
      pattern: Name20,
      style: { width: '100%' },
      errorTip: { required: '用户名为必填项', maxlength: '用户名最大长度20', minlength: '用户名最小长度4', pattern: '无效的用户名' },
      label: '用户名',
    },
    {
      name: 'password',
      required: true,
      maxLength: 16,
      minLength: 6,
      pattern: Password16,
      style: { width: '100%' },
      errorTip: { required: '请输入密码', maxlength: '密码最大长度16', minlength: '密码最小长度要求6个字符', pattern: '无效的密码' },
      label: '密码',
      type: 'password',
    },
    {
      name: 'captcha',
      required: true,
      type: 'otp',
      maxLength: 4,
      style: { width: '100%' },
      label: '验证码',

      errorTip: '输入右侧验证码图片上的验证码',
      tooltip: '点击刷新，五分钟内有效',
      validators: form => [
        (control: AbstractControl): ValidationErrors => {
          if (!control.value) {
            return { required: true };
          } else if (control.value?.toLowerCase() !== this.captchaCode.toLocaleLowerCase()) {
            return { error: true };
          }
          return {};
        },
      ],
    },
  ];
  captchaCode = '';
  captchaExpired = false;
  #auth = inject(AuthService);
  #router = inject(Router);

  ngOnInit(): void {
    const captchaSchema = this.formSchema.find(s => s.name === 'captcha');
    if (captchaSchema) {
      captchaSchema.addOnAfter = this.captchaTpl;
    }
  }
  handleVerifCodeChange(e: any) {
    this.captchaCode = e.code;
    this.captchaExpired = e.type === 'expired';
    if (this.captchaCode) {
    }
  }

  async submitForm(e: { raw: any; value: any }) {
    if (await this.#auth.login(e.value)) {
      setTimeout(() => {
        const redirect = this.#router.parseUrl(this.#router.url).queryParams['redirect'] ?? '/';
        this.#router.navigateByUrl(redirect);
      });
    }
  }

  @HostListener('click')
  handleClick() {
    // this.#router.navigateByUrl(`/auth/login?redirect=asgbd`);
  }
}
