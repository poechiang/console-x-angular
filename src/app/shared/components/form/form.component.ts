import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, Validators } from '@angular/forms';

import { Subject } from 'rxjs';

@Component({
  selector: 'cx-form',
  exportAs: 'cxForm',
  standalone: false,
  templateUrl: './form.component.html',
  styleUrl: './form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxFormComponent implements OnInit, OnDestroy {
  @Input('cxLabel') label?: number | 'block' | 'inline';
  @Input('cxAutoPlaceholder') autoPlaceholder?: boolean;
  @Input('cxFormSchema') formSchema?: CxFormSchema[];
  @Input('cxAgreement') agreement?: { text: string; link: string; value?: boolean };
  @Input('cxInitValue') initValue?: any;
  @Input('cxReset') reset?: string | null;
  @Input('cxSubmit') submit?: string;
  @Output() valueChange = new EventEmitter<{ field: string; value: any; control: AbstractControl }>();
  @Output('submit') onSubmit = new EventEmitter<{ value: any; raw: any }>();
  @Output('reset') onReset = new EventEmitter<void>();

  private fb = inject(UntypedFormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  hasHelp = false; //是否需要显示说明列
  form = this.fb.group({});

  ngOnInit() {
    this.initForm();

    this.hasHelp = this.formSchema?.some(s => !!s.help) ?? false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  parseHelp(help: string | { spin: boolean; content: string }): { spin: boolean; content: string } {
    if (typeof help === 'string') {
      return { spin: false, content: help };
    } else {
      return { spin: !!help.spin, content: help.content };
    }
  }

  initForm() {
    if (!this.formSchema) {
      return;
    }

    this.formSchema.forEach(item => {
      const validators = [];
      if (item.required) {
        validators.push(Validators.required);
      }
      if (item.maxLength) {
        validators.push(Validators.maxLength(item.maxLength));
      }
      if (item.minLength) {
        validators.push(Validators.minLength(item.minLength));
      }
      if (item.pattern) {
        validators.push(Validators.pattern(item.pattern));
      }
      const ctrl = this.fb.control(this.initValue?.[item.name] ?? null, {
        validators: [...validators, ...(item.validators?.(this.form) ?? [])],
        updateOn: item.updateOn ?? 'change',
      });

      if (item.disabled) {
        ctrl.disable();
      }

      ctrl.valueChanges.subscribe(e => this.valueChange.emit({ field: item.name, value: e, control: ctrl }));

      this.form.addControl(item.name, ctrl);
    });

    if (this.agreement) {
      this.form.addControl('agree', this.fb.control(null));
    }
  }

  resetForm(e?: MouseEvent) {
    this.form?.reset(this.initValue ?? {});
  }

  submitForm(e?: MouseEvent): void {
    if (this.form?.valid) {
      this.onSubmit.emit({ value: this.form.value, raw: this.form.getRawValue() });
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control?.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
1;
