import type { FormField } from "../../types/formsTypes";

const FieldError = ({ error }: { error?: string }) =>
  error ? <p className="mt-1 text-sm text-red-400">{error}</p> : null;

export function FieldRenderer({
  field,
  value,
  error,
  touched,
  onChange,
}: {
  field: FormField;
  value: unknown;
  error?: string;
  touched?: boolean;
  onChange: (fieldId: string, value: unknown) => void;
}) {
  console.log(field)
  const commonLabel = (
    <label className="block text-sm font-medium text-white mb-1">
      {field.label}
      {field.required && <span className="text-red-500"> *</span>}
    </label>
  );

  const commonClass = `w-full px-3 py-2 border rounded-md bg-slate-700 text-white ${
    error && touched ? "border-red-500" : "border-slate-600"
  }`;

  switch (field.type) {
    case "Text":
    case "Number":
      return (
        <div className="mb-4">
          {commonLabel}
          <input
            type={field.type === "Number" ? "number" : "text"}
            value={(value as string) || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={commonClass}
          />
          {touched && <FieldError error={error} />}
        </div>
      );

    case "Textarea":
      return (
        <div className="mb-4">
          {commonLabel}
          <textarea
            value={(value as string) || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={commonClass}
            rows={3}
          />
          {touched && <FieldError error={error} />}
        </div>
      );

    case "Select":
      return (
        <div className="mb-4">
          {commonLabel}
          <select
            value={(value as string) || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={commonClass}
          >
            <option value="">Select an option</option>
            {(field.options as string[])?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {touched && <FieldError error={error} />}
        </div>
      );

    case "Radio":
      return (
        <div className="mb-4">
          {commonLabel}
          <div className="space-y-2">
            {(field.options as string[])?.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.id}-${option}`}
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={() => onChange(field.id, option)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600"
                />
                <label
                  htmlFor={`${field.id}-${option}`}
                  className="ml-2 block text-sm text-slate-300"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
          {touched && <FieldError error={error} />}
        </div>
      );

    case "Checkbox":
      return (
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.id}
              checked={Boolean(value)}
              onChange={(e) => onChange(field.id, e.target.checked)}
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
          {touched && <FieldError error={error} />}
        </div>
      );

    case "Date":
      return (
        <div className="mb-4">
          {commonLabel}
          <input
            type="date"
            value={(value as string) || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={commonClass}
          />
          {touched && <FieldError error={error} />}
        </div>
      );

    default:
      return null;
  }
}