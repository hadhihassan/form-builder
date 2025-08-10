/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { FormField, SelectOption } from "../types/formsTypes";

function PreviewForm() {
  const location = useLocation();

  const { formId } = location.state as { formId: string };
  const form = useSelector((state: RootState) => state.form.items).find(
    (form) => form.id === formId
  );

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Initialize form data with default values
  useEffect(() => {
    if (form) {
      const initialData: Record<string, any> = {};
      form.fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          initialData[field.id] = field.defaultValue;
        } else if (field.type === "Checkbox") {
          initialData[field.id] = false;
        } else {
          initialData[field.id] = "";
        }
      });
      setFormData(initialData);
    }
  }, [form]);

  const calculateDerivedFields = useCallback(
    (currentData: Record<string, any>) => {
      if (!form) return currentData;

      const derivedFields = form.fields.filter((field) => field.isDerived);
      const newData = { ...currentData };
      let hasChanges = false;

      derivedFields.forEach((field) => {
        if (field.parentFields && field.derivationLogic) {
          try {
            const parentValues = field.parentFields.reduce(
              (acc, parentId) => {
                const parentField: FormField[] = form?.fields?.filter(
                  (f) => f.id === parentId
                ) as unknown as FormField[];
                acc[parentField[0]?.label] = currentData[parentId];
                return acc;
              },
              {} as Record<string, any>
            );

            const sanitizedLogic = field.derivationLogic;

            const derivedValue = new Function(
              "parents",
              `return ${sanitizedLogic}`
            )(parentValues);

            if (newData[field.id] !== derivedValue) {
              newData[field.id] = derivedValue;
              hasChanges = true;
            }
          } catch (error) {
            console.error("Error evaluating derived field:", error);
          }
        }
      });

      return hasChanges ? newData : currentData;
    },
    [form]
  );

  const handleChange = (fieldId: string, value: any) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [fieldId]: value };
      return calculateDerivedFields(updatedData);
    });
    setTouched((prev) => ({ ...prev, [fieldId]: true }));
    validateField(fieldId, value.trim());
  };

  const validateField = (fieldId: string, value: any): string => {
    const trimedValue = value.trim();
    if (!form) return "";

    const field = form.fields.find((f) => f.id === fieldId);
    if (!field) return "";

    const fieldErrors: string[] = [];

    if (field.required && !trimedValue) {
      fieldErrors.push(
        field.validations?.find((v) => v.type === "required")?.message ||
          "This field is required"
      );
    }

    if (field.validations) {
      field.validations.forEach((validation) => {
        console.log(validation.type);
        switch (validation.type) {
          case "notEmpty":
            if (!trimedValue) {
              fieldErrors.push(`This field not be empty`);
            }
            break;
          case "minLength":
            if (trimedValue && trimedValue.length < Number(validation.value)) {
              fieldErrors.push(`Minimum length is ${validation.value}`);
            }
            break;
          case "maxLength":
            if (trimedValue && trimedValue.length > Number(validation.value)) {
              fieldErrors.push(`Maximum length is ${validation.value}`);
            }
            break;
          case "email":
            if (
              trimedValue &&
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimedValue)
            ) {
              fieldErrors.push("Please enter a valid email");
            }
            break;
          case "password":
            if (
              trimedValue &&
              !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(trimedValue)
            ) {
              fieldErrors.push(
                "Password must contain at least 8 characters, including uppercase, lowercase, and numbers"
              );
            }
            break;
        }
      });
    }

    return fieldErrors[0] || "";
  };

  const renderField = (field: FormField) => {
    if (!form) return "";

    const fieldError = errors[field.id];
    const isTouched = touched[field.id];

    switch (field.type) {
      case "Text":
      case "Number":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-white mb-1">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <input
              type={field.type === "Number" ? "number" : "text"}
              value={formData[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-slate-700 text-white ${
                fieldError && isTouched ? "border-red-500" : "border-slate-600"
              }`}
            />
            {fieldError && isTouched && (
              <p className="mt-1 text-sm text-red-400">{fieldError}</p>
            )}
          </div>
        );

      case "Textarea":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-white mb-1">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <textarea
              value={formData[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-slate-700 text-white ${
                fieldError && isTouched ? "border-red-500" : "border-slate-600"
              }`}
              rows={3}
            />
            {fieldError && isTouched && (
              <p className="mt-1 text-sm text-red-400">{fieldError}</p>
            )}
          </div>
        );

      case "Select":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-white mb-1">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <select
              value={formData[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-slate-700 text-white ${
                fieldError && isTouched ? "border-red-500" : "border-slate-600"
              }`}
            >
              <option value="">Select an option</option>
              {(field.options as string[])?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {fieldError && isTouched && (
              <p className="mt-1 text-sm text-red-400">{fieldError}</p>
            )}
          </div>
        );

      case "Radio":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-white mb-1">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <div className="space-y-2">
              {(field.options as SelectOption[])?.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    id={`${field.id}-${option.value}`}
                    name={field.id}
                    value={option.value}
                    checked={formData[field.id] === option.value}
                    onChange={() => handleChange(field.id, option.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600"
                  />
                  <label
                    htmlFor={`${field.id}-${option.value}`}
                    className="ml-2 block text-sm text-slate-300"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {fieldError && isTouched && (
              <p className="mt-1 text-sm text-red-400">{fieldError}</p>
            )}
          </div>
        );

      case "Checkbox":
        return (
          <div key={field.id} className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={field.id}
                checked={Boolean(formData[field.id])}
                onChange={(e) => handleChange(field.id, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded"
              />
              <label
                htmlFor={field.id}
                className="ml-2 block text-sm text-slate-300"
              >
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
              </label>
            </div>
            {fieldError && isTouched && (
              <p className="mt-1 text-sm text-red-400">{fieldError}</p>
            )}
          </div>
        );

      case "Date":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-white mb-1">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <input
              type="date"
              value={formData[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-slate-700 text-white ${
                fieldError && isTouched ? "border-red-500" : "border-slate-600"
              }`}
            />
            {fieldError && isTouched && (
              <p className="mt-1 text-sm text-red-400">{fieldError}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    const newErrors: Record<string, string> = {};
    let hasErrors: boolean = false;

    form.fields.forEach((field) => {
      const error = validateField(field.id, formData[field.id]);
      validateField(field.id, formData[field.id].trim());
      if (error) {
        newErrors[field.id] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(formData).reduce(
        (acc, key) => {
          acc[key] = true;
          return acc;
        },
        {} as Record<string, boolean>
      )
    );

    if (!hasErrors) {
      console.log("Form submitted:", formData);
      toast.success(`Your ${form.name} form has been submitted successfully!`, {
        duration: 3000,
      });
    }
  };

  if (!form) {
    return <div className="text-white p-4">Form not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">{form.name}</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 p-6 rounded-lg shadow-lg"
        >
          {form.fields.map(renderField)}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default PreviewForm;
