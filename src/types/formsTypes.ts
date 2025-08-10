// src/types/formsTypes.ts
export type FieldType =
  | "Text"
  | "Number"
  | "Textarea"
  | "Select"
  | "Radio"
  | "Checkbox"
  | "Date";

export type ValidationType = 
  | 'notEmpty' 
  | 'required' 
  | 'minLength' 
  | 'maxLength' 
  | 'email' 
  | 'password';

export interface ValidationTypes {
  label :string,
  value:string
}

export interface ValidationRule {
  type: ValidationType;
  value?: string | number;
  message: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: string | number ;
  placeholder?: string;
  options?: SelectOption[] | string[];
  validations?: ValidationRule[];
  isDerived?: boolean;
  parentFields?: string[];
  derivationLogic?: string;
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string;
  fields: FormField[];
}

export interface FormsState {
  forms: FormSchema[];
  currentFormId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}