/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { FormField } from "../types/formsTypes";
import { useDerivedFields } from "../hooks/useDerivedFields";
import { validateField } from "../utils/validation";
import { FieldRenderer } from "../component/Form/renderField";

function PreviewForm() {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const location = useLocation();

  const { formId } = location.state as { formId: string };
  const form = useSelector((state: RootState) => state.form.items).find(
    (form) => form.id === formId
  );

  const calculateDerivedFields = useDerivedFields(form);

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

  const handleChange = (fieldId: string, value: any) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [fieldId]: value } as Record<
        string,
        never
      >;
      return calculateDerivedFields(updatedData);
    });
    setTouched((prev) => ({ ...prev, [fieldId]: true }));
    if (!form) return;
    const field = form.fields.find((f) => f.id === fieldId) as FormField;
    validateField(field, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    const newErrors: Record<string, string> = {};
    let hasErrors: boolean = false;

    form.fields.forEach((field) => {
      const error = validateField(field, formData[field.id]);
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
      toast.success(`Your ${form.name} form has been submitted successfully!`, {
        duration: 3000,
      });
      setFormData({});
      setErrors({});
      setTouched({});
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
          {form.fields.map((field) => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={formData[field.id]}
              error={errors[field.id]}
              touched={touched[field.id]}
              onChange={handleChange}
            />
          ))}

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
