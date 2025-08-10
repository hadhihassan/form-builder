import { useCallback } from "react";
import type { FormField } from "../types/formsTypes";

export function useDerivedFields(form: { fields: FormField[] } | undefined) {
    return useCallback(
        (currentData: Record<string, never>) => {
            if (!form) return currentData;
            const derivedFields = form.fields.filter((f) => f.isDerived);
            const newData = { ...currentData } as Record<string, unknown>;
            let hasChanges = false;

            derivedFields.forEach((field) => {
                if (field.parentFields && field.derivationLogic) {
                    try {
                        const parents = field.parentFields.reduce((acc, id) => {
                            const parent = form.fields.find((f) => f.id === id);
                            if (parent) acc[parent.label] = currentData[id];
                            return acc;
                        }, {} as Record<string, unknown>);

                        const derivedValue = new Function("parents", `return ${field.derivationLogic}`)(parents);

                        if (newData[field.id] !== derivedValue) {
                            newData[field.id] = derivedValue;
                            hasChanges = true;
                        }
                    } catch (err) {
                        console.error("Error evaluating derived field:", err);
                    }
                }
            });

            return hasChanges ? newData : currentData;
        },
        [form]
    );
}
