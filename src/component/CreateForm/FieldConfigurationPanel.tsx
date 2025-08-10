import type {
  FormField,
  ValidationType,
  ValidationTypes,
} from "../../types/formsTypes";

type Props = {
  selectedField: FormField | null;
  fields: FormField[];
  updateField: (id: string, updates: Partial<FormField>) => void;
  VALIDATION_TYPES: ValidationTypes[];
  openValidationInput: (validation: ValidationTypes) => void;
  isMinLength: boolean;
  isMaxLength: boolean;
  handleValidationToggle: (
    validationType: ValidationType,
    checked: boolean
  ) => void;
  handleValidationInputValues: (
    type: "minLength" | "maxLength",
    selectedField: FormField,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  isDerived: boolean;
  setIsDerived: React.Dispatch<React.SetStateAction<boolean>>;
};

function FieldConfigurationPanel({
  selectedField,
  fields,
  updateField,
  VALIDATION_TYPES,
  openValidationInput,
  isMinLength,
  isMaxLength,
  handleValidationToggle,
  handleValidationInputValues,
  isDerived,
  setIsDerived,
}: Props) {
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
      {selectedField ? (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Field Configuration
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Label / Name
              </label>
              <input
                type="text"
                value={selectedField.label}
                onChange={(e) =>
                  updateField(selectedField.id, { label: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-slate-700 text-white"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="required"
                checked={selectedField.required}
                onChange={(e) =>
                  updateField(selectedField.id, {
                    required: e.target.checked,
                  })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-700"
              />
              <label
                htmlFor="required"
                className="ml-2 block text-sm text-slate-300"
              >
                Required Field
              </label>
            </div>

            {["text", "number", "textarea"].includes(selectedField.type) && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Default Value
                </label>
                <input
                  type={selectedField.type === "Number" ? "number" : "text"}
                  value={selectedField.defaultValue}
                  onChange={(e) =>
                    updateField(selectedField.id, {
                      defaultValue: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-slate-700 text-white"
                />
              </div>
            )}

            {selectedField.type === "Select" && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Options (comma separated)
                </label>
                <input
                  type="text"
                  value={selectedField.options?.join(", ") || ""}
                  onChange={(e) =>
                    updateField(selectedField.id, {
                      options: e.target.value.split(",").map((o) => o.trim()),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-slate-700 text-white"
                  placeholder="Option 1, Option 2, Option 3"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Validations
              </label>
              <div className="space-y-2">
                {VALIDATION_TYPES.map((validation) => (
                  <div key={validation.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={validation.value}
                      onClick={() => openValidationInput(validation)}
                      checked={
                        selectedField.validations?.some(
                          (v) => v.type === validation.value
                        ) || false
                      }
                      onChange={(e) =>
                        handleValidationToggle(
                          validation.value as ValidationType,
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-700"
                    />
                    <label
                      htmlFor={validation.value}
                      className="ml-2 block text-sm text-slate-300"
                    >
                      {validation.label}
                    </label>
                    {isMinLength && validation.value == "minLength" && (
                      <input
                        type="number"
                        className="border border-slate-600 ml-5 rounded-md w-1/3 outline-none px-2 bg-slate-700 text-white"
                        onChange={(e) =>
                          handleValidationInputValues(
                            "minLength",
                            selectedField,
                            e
                          )
                        }
                      />
                    )}
                    {isMaxLength && validation.value == "maxLength" && (
                      <input
                        onChange={(e) =>
                          handleValidationInputValues(
                            "maxLength",
                            selectedField,
                            e
                          )
                        }
                        type="number"
                        className="border border-slate-600 ml-5 rounded-md w-1/3 outline-none px-2 bg-slate-700 text-white"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDerived"
                  checked={isDerived}
                  onChange={(e) => {
                    setIsDerived(e.target.checked);
                    updateField(selectedField.id, {
                      isDerived: e.target.checked,
                    });
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-700"
                />
                <label
                  htmlFor="isDerived"
                  className="ml-2 block text-sm text-slate-300"
                >
                  Derived Field
                </label>
              </div>

              {isDerived && (
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Parent Fields
                    </label>
                    <select
                      multiple
                      value={selectedField.parentFields || []}
                      onChange={(e) => {
                        const options = Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        );
                        updateField(selectedField.id, {
                          parentFields: options,
                        });
                      }}
                      className="w-full px-3 py-2 border border-slate-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-slate-700 text-white"
                    >
                      {fields
                        ?.filter((f) => f.id !== selectedField.id)
                        ?.map((field) => (
                          <option key={field.id} value={field.id}>
                            {field.label}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Derivation Logic
                    </label>
                    <textarea
                      value={selectedField.derivationLogic || ""}
                      onChange={(e) =>
                        updateField(selectedField.id, {
                          derivationLogic: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-slate-700 text-white"
                      placeholder="Example: parentField1 + ' ' + parentField2"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400">
          <p>
            {fields?.length === 0
              ? "Add a field to start configuring"
              : "Select a field to configure"}
          </p>
        </div>
      )}
    </div>
  );
}

export default FieldConfigurationPanel;
