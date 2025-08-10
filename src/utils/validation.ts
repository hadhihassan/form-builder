import type { FormField } from "../types/formsTypes";

export function validateField(field: FormField, value: string | string): string {
    const trimmed = typeof value === "string" ? (value as string).trim() : value;
    const errors: string[] = [];

    if (field.isDerived) {
        return errors[0] || "";
    }

    if (field.required && !trimmed) {
        errors.push(
            field.validations?.find((v) => v.type === "required")?.message ||
            "This field is required"
        );
    }

    if (field.validations) {
        field.validations.forEach((v) => {
            switch (v.type) {
                case "notEmpty":
                    if (!trimmed) errors.push("This field must not be empty");
                    break;
                case "minLength":
                    if (trimmed && trimmed.length < Number(v.value)) {
                        errors.push(`Minimum length is ${v.value}`);
                    }
                    break;
                case "maxLength":
                    if (trimmed && trimmed.length > Number(v.value)) {
                        errors.push(`Maximum length is ${v.value}`);
                    }
                    break;
                case "email":
                    if (trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
                        errors.push("Please enter a valid email");
                    }
                    break;
                case "password":
                    if (
                        trimmed &&
                        !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(trimmed)
                    ) {
                        errors.push(
                            "Password must contain at least 8 characters, including uppercase, lowercase, and numbers"
                        );
                    }
                    break;
            }
        });
    }

    return errors[0] || "";
}
