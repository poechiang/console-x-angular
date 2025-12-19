import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { CxFormModule } from '@com/form/form.module';

import { Router } from '@angular/router';
import { CxPageBodyComponent } from '@com/page-body/page-body.component';
import { HttpsService } from '@srv/https.service';
import { debounce } from '@utl/debounce';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { Subject } from 'rxjs';
import { userFormSchema } from './schema';
@Component({
  selector: 'cx-register',
  exportAs: 'cxRegister',
  imports: [
    CxPageBodyComponent,
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzIconModule,
    NzToolTipModule,
    CxFormModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.less',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxRegisterComponent implements OnInit, AfterViewInit, OnDestroy {
  #fb = inject(UntypedFormBuilder);
  #destroy$ = new Subject<void>();
  @ViewChild('phonePrefixFormItemCtrl', { static: true }) phonePrefixFormItemCtrl?: TemplateRef<any>;
  @ViewChild('sendSmsVerifyCodeButton', { static: true }) sendSmsVerifyCodeButton?: TemplateRef<any>;
  @ViewChild('userCheck', { static: true }) userCheck?: TemplateRef<any>;
  formSchema: any[] = [...userFormSchema];
  agreement = {
    text: '用户协议',
    link: '/auth/register',
  };

  private https = inject(HttpsService);
  private msg = inject(NzMessageService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    const item = this.formSchema.find(x => x.name === 'phone');
    if (item) {
      item.addOnBefore = this.phonePrefixFormItemCtrl;
    }
    this.formSchema = [...this.formSchema];
  }
  ngOnInit() {
    this.formSchema.find(x => x.name === 'confirm').validators = this.confirmationValidator;
    this.formSchema.find(x => x.name === 'captcha').addOnAfter = this.sendSmsVerifyCodeButton;
  }

  ngOnDestroy(): void {
    this.#destroy$.next();
    this.#destroy$.complete();
  }

  handleValueChange(e: { field: string; value: any; control: AbstractControl }) {
    if (e.field === 'userName') {
      this.checkUserExist(e);
    }
  }

  async submitForm(e: { raw: any; value: any }) {
    const { agree, captcha, confirm, ...userData } = e.value;
    if (!agree) {
      this.msg.error('请同意用户协议');
      return;
    }
    if (!captcha) {
      this.msg.error('请填写验证码');
      return;
    }
    if (!confirm) {
      this.msg.error('请确认密码');
      return;
    }
    const res = await this.https.post('/users', userData);
    if (res) {
      this.msg.success('创建用户成功，稍后跳转登录页面');
      setTimeout(() => {
        this.router.navigateByUrl('/auth/login');
      });
    }
  }

  confirmationValidator = (form: UntypedFormGroup) => [
    (control: AbstractControl): ValidationErrors => {
      if (!control.value) {
        return { required: true };
      } else if (control.value !== form.controls['password'].value) {
        return { confirm: true, error: true };
      }
      return {};
    },
  ];

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }
  private checkUserExist = debounce(async (e: { field: string; value: any; control: AbstractControl }) => {
    if (e.value && e.control.valid) {
      this.updateUserNameHelp('检查中...', true);

      const { exist } = await this.https.get(`users/${e.value}/exist`);

      if (exist) {
        e.control.setErrors({ error: true });
      }
      this.updateUserNameHelp(exist ? '指定名称用户已存在' : '用户名可用');
    } else {
      if (e.control.valid) {
        e.control.setErrors({ required: true });
      }
      this.updateUserNameHelp('用户登录名，长度不超过20个字符');
    }
  }, 800);

  private updateUserNameHelp(help: string, spin?: boolean) {
    const item = this.formSchema.find(x => x.name === 'userName');

    item.help = { content: help, spin };

    this.formSchema = [...this.formSchema];
    this.cdr.detectChanges();
  }
}
