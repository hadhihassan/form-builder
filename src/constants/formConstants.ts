import type { FieldType, ValidationTypes } from "../types/formsTypes";

export const FIELD_TYPES: FieldType[] = [
    "Text",
    "Number",
    "Textarea",
    "Select",
    "Checkbox",
    "Date",
    "Radio",
];

export const VALIDATION_TYPES: ValidationTypes[] = [
    { label: "Not Empty", value: "notEmpty" },
    { label: "Min Length", value: "minLength" },
    { label: "Max Length", value: "maxLength" },
    { label: "Email Format", value: "email" },
    { label: "Password Rules", value: "password" },
] as const;