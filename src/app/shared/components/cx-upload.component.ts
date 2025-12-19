import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';

export type CxUploadOnChange = (fileList: NzUploadFile | NzUploadFile[]) => void;
export type CxUploadOnTouched = () => void;

@Component({
  selector: 'cx-upload',
  imports: [CommonModule, NzUploadModule, NzIconModule],
  template: `<nz-upload
    class="cx-uploader"
    [nzAccept]="accept"
    [nzAction]="action"
    [nzName]="name"
    nzListType="picture-card"
    [nzShowUploadList]="showUploadList"
    [nzBeforeUpload]="beforeUpload"
    (nzChange)="handleChange($event)"
  >
    <ng-content></ng-content>
  </nz-upload>`,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CxUploadComponent), multi: true }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxUploadComponent implements ControlValueAccessor {
  @Input('cxAction') action = '';
  /** 禁用状态 */
  @Input('cxDisabled') disabled = false;
  @Input('cxAccept') accept: string | string[] = '';
  @Input('cxName') name = 'file';
  /** 文件列表 */
  @Input('cxValue') fileList: NzUploadFile | NzUploadFile[] = [];
  @Input('cxUploadFileSize') uploadFileSize = 0;
  @Input('cxUploadFileTypes') uploadFileTypes = ['*'];
  @Input('cxShowUploadList') showUploadList = false;
  @Input('cxPreview') preview?: TemplateRef;

  #onChange?: CxUploadOnChange;
  #onTouched?: CxUploadOnTouched;
  #cdr = inject(ChangeDetectorRef);

  get finalFileList(): NzUploadFile[] {
    return Array.isArray(this.fileList) ? this.fileList : this.fileList ? [this.fileList] : [];
  }

  writeValue(obj: any): void {
    this.fileList = obj ?? (this.showUploadList ? [] : null);
    this.#cdr.markForCheck();
  }
  registerOnChange(fn: CxUploadOnChange): void {
    this.#onChange = fn;
  }
  registerOnTouched(fn: CxUploadOnTouched): void {
    this.#onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.#cdr.markForCheck();
  }

  handleChange(info: { file: NzUploadFile; fileList: NzUploadFile[] }): void {
    this.fileList = this.showUploadList ? info.fileList : info.file;
    this.#onChange?.(this.fileList);
    this.#onTouched?.();
    this.#cdr.markForCheck();
  }

  private isValidImageFile(ext: string): boolean {
    return this.uploadFileTypes.map(x => x.toLowerCase()).some(t => t === '*' || t.includes(ext));
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    let result = true;
    const fileTypeValid = this.isValidImageFile(file.type!);
    if (!fileTypeValid) {
      result = false;
    }
    const isLt2M = this.uploadFileSize === 0 || file.size! < this.uploadFileSize;
    if (!isLt2M) {
      result = false;
    }

    if (!this.action) {
      result = false;
    }

    if (!result) {
      // this.handleChange({ file, fileList: [] });

      this.#onChange?.(file);
      this.#onTouched?.();
      this.#cdr.markForCheck();
    }
    return result;
  };
}
