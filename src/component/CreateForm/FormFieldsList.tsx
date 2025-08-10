import type { FormField } from "../../types/formsTypes";

type Props = {
  fields: FormField[];
  formName: string;
  setFormName: (name: string) => void;
  saveForm: () => void;
  setSelectedField: (field: FormField) => void;
  selectedField: FormField | null;
  moveField: (id: string, dir: "up" | "down") => void;
  removeField: (id: string) => void;
  setIsDerived: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function FormFieldsList({
  fields,
  formName,
  setFormName,
  saveForm,
  setSelectedField,
  selectedField,
  moveField,
  removeField,
  setIsDerived
}: Props) {
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Form Fields</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="px-3 py-1 border border-slate-600 rounded-md text-sm outline-none bg-slate-700 text-white"
          />
          <button
            onClick={saveForm}
            disabled={fields?.length === 0}
            className={`px-4 py-1 rounded-md text-sx  transition-colors  ${
              fields?.length === 0
                ? "bg-slate-600 cursor-not-allowed text-slate-400"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Save
          </button>
        </div>
      </div>

      {fields?.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <p>No fields added yet. Click on field types to add them.</p>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto max-h-[350px]">
          {fields?.map((field, index) => (
            <div
              key={field.id}
              onClick={() => {
                setSelectedField(field)
                setIsDerived(field.isDerived || false)
              }}
              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                selectedField?.id === field.id
                  ? "border-blue-500 bg-slate-700"
                  : "border-slate-600 hover:bg-slate-700"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-white">{field.label}</span>
                  <span className="ml-2 text-xs bg-slate-600 px-2 py-1 rounded text-slate-300 capitalize">
                    {field.type}
                  </span>
                  {field.required && (
                    <span className="ml-2 text-xs bg-red-900 px-2 py-1 rounded text-red-300">
                      Required
                    </span>
                  )}
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveField(field.id, "up");
                    }}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-blue-400 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveField(field.id, "down");
                    }}
                    disabled={index === fields?.length - 1}
                    className="p-1 text-slate-400 hover:text-blue-400 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeField(field.id);
                    }}
                    className="p-1 text-slate-400 hover:text-red-400"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
