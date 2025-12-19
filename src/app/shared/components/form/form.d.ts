declare type TemplateRef = import('@angular/core').TemplateRef;
declare type UntypedFormGroup = import('@angular/forms').UntypedFormGroup;
declare type ValidatorFn = import('@angular/forms').ValidatorFn;
declare type AbstractControlOptions = import('@angular/forms').AbstractControlOptions;

declare interface CxFormSchema {
  name: string;
  required?: boolean;
  divider?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string | RegExp;
  errorTip?: string | { [key: string]: string };
  label?: string;
  placeholder?: string;
  type?: 'input' | 'text' | 'password' | 'upload' | 'otp'; // 黑夜 input
  help?: string | { spin: boolean; content: string };
  tooltip?: string;
  addOnAfter?: TemplateRef<any>;
  addOnBefore?: TemplateRef<any>;
  prefix?: TemplateRef<any>;
  suffix?: TemplateRef<any>;
  custom?: boolean;
  template?: TemplateRef<any>;
  disabled?: boolean;
  // action?: { type?: 'button' | 'link' | 'custom'; content: TemplateRef<void> | string; click: (e: MouseEvent) => void; disabled?: boolean };
  style?: { width?: string | number } & { [key: string]: string | number };
  updateOn?: AbstractControlOptions['updateOn'];
  validators?: (form: UntypedFormGroup) => ValidatorFn[];
}
