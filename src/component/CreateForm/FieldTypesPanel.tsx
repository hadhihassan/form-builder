import type { FieldType } from "../../types/formsTypes";

type Props = {
  FIELD_TYPES: FieldType[];
  onAddField: (type: FieldType) => void;
};

function FieldTypesPanel({ FIELD_TYPES, onAddField }: Props) {
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
      <h2 className="text-xl font-semibold text-white mb-4">Add Field</h2>
      <div className="grid grid-cols-2 gap-3 ">
        {FIELD_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onAddField(type)}
            className="flex items-center justify-center p-3 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
          >
            <span className="text-blue-300 font-medium capitalize">{type}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FieldTypesPanel;
