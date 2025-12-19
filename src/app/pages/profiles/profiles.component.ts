import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CxFormModule } from '@com/form/form.module';
import { Name20, Password16 } from '@const/regexp';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@srv/auth.service';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'cx-profiles',
  imports: [
    NzInputModule,
    NzUploadModule,
    NzIconModule,
    CommonModule,
    NzFormModule,
    ReactiveFormsModule,
    NzDropDownModule,
    NzIconModule,
    NzAvatarModule,
    RouterModule,
    TranslateModule,
    CxFormModule,
  ],
  exportAs: 'cxProfiles',
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxProfilesComponent {
  #msg = inject(NzMessageService);
  #fb = inject(UntypedFormBuilder);
  loading = false;
  authSrv = inject(AuthService);

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
      name: 'email',
      required: true,
      maxLength: 16,
      minLength: 6,
      pattern: Password16,
      style: { width: '100%' },
      errorTip: { required: '请输入密码', maxlength: '密码最大长度16', minlength: '密码最小长度要求6个字符', pattern: '无效的密码' },
      label: '电子邮箱',
    },
    {
      name: 'avatar',
      type: 'upload',
      style: { width: '100%' },
      errorTip: { required: '请输入密码', maxlength: '密码最大长度16', minlength: '密码最小长度要求6个字符', pattern: '无效的密码' },
      label: '头像',
    },
  ];

  handleChange(info: { file: NzUploadFile }): void {
    if (info.file.status === 'uploading') {
      this.loading = true;
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.#msg.success('上传成功');
      this.loading = false;
    }
  }
  handleValueChange(e: { field: string; value: any; control: AbstractControl }) {
    console.log('valueChange', e);
  }

  submitForm(e: { raw: any; value: any }) {
    console.log('submit', e);
  }
}
