import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

import { CxUploadComponent } from '@com/cx-upload.component';
import { CxLf2brPipe } from '@pip/lf2br.pipe';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { CxFormComponent } from './form.component';
import { CxFormErrorPipe } from './pipes/form-error.pipe';
import { CxFormPlhPipe } from './pipes/form-plh.pipe';
import { CxFormWidthPipe } from './pipes/form-width.pipe';

@NgModule({
  declarations: [CxFormComponent, CxFormWidthPipe, CxFormPlhPipe, CxFormErrorPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzIconModule,
    NzTooltipModule,
    NgTemplateOutlet,
    NzDividerModule,
    NzSpaceModule,
    NzUploadModule,
    CxLf2brPipe,
    CxUploadComponent,
  ],
  exports: [CxFormComponent],
})
export class CxFormModule {}
