import { useEffect, useState } from "react";
import type {
  FieldType,
  FormField,
  ValidationType,
  ValidationTypes,
} from "../types/formsTypes";
import { toast } from "sonner";
import { FIELD_TYPES, VALIDATION_TYPES } from "../constants/formConstants";
import { setErrorMessage } from "../utils/formUtils";
import FieldTypesPanel from "../component/CreateForm/FieldTypesPanel";
import FormFieldsList from "../component/CreateForm/FormFieldsList";
import FieldConfigurationPanel from "../component/CreateForm/FieldConfigurationPanel";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { addItem, updateItem } from "../redux/slice/formSlice";

function CreateForm() {
  const [formName, setFormName] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [isDerived, setIsDerived] = useState(false);

  const [isMinLength, setIsMinLength] = useState<boolean>(false);
  const [isMaxLength, setIsMaxLength] = useState<boolean>(false);

  const location = useLocation();
  const dispatch = useDispatch();

  const formId = (location.state as { formId?: string })?.formId;

  const data = useSelector((state: RootState) => state.form.items).find(
    (form) => form.id === formId
  );

  useEffect(() => {
    if (formId && data) {
      setFormName(data.name);
      setFields(data.fields);
    }
  }, [data, formId]);

  // Add new Field in form
  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      defaultValue: "",
      validations: [],
      isDerived: false,
      parentFields: [],
      derivationLogic: "",
    };
    setFields([...fields, newField]);
    setSelectedField(newField);
  };

  // Update field in form
  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
    if (selectedField?.id === id) {
      setSelectedField({ ...selectedField, ...updates });
    }
  };

  // Remove field in form
  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
    if (selectedField?.id === id) {
      setSelectedField(null);
    }
  };

  // change field position in form
  const moveField = (id: string, direction: "up" | "down") => {
    const index = fields.findIndex((f) => f.id === id);
    if (index === -1) return;

    const newFields = [...fields];
    if (direction === "up" && index > 0) {
      [newFields[index], newFields[index - 1]] = [
        newFields[index - 1],
        newFields[index],
      ];
    } else if (direction === "down" && index < fields.length - 1) {
      [newFields[index], newFields[index + 1]] = [
        newFields[index + 1],
        newFields[index],
      ];
    }
    setFields(newFields);
  };

  // Save form
  const saveForm = () => {
    if (!formName.trim()) {
      toast.warning("Plase enter you form name", {
        duration: 1000,
      });
      return;
    }
    const formData = {
      id: Date.now().toString(),
      name: formName,
      createdAt: new Date().toISOString(),
      fields,
    };

    if (formId) {
      dispatch(updateItem({ id: formId, changes: formData }));
    } else {
      dispatch(addItem(formData));
    }

    toast.success(`Form ${formName} saved successfully.`);
    setFormName("");
    setFields([]);
    setSelectedField(null);
  };

  // Add new feidl in form
  const handleAddFieldClick = (type: FieldType): void => {
    addField(type);
    setIsMinLength(false);
    setIsMaxLength(false);
  };

  // Open validation input fields
  const openValidationInput = (validation: ValidationTypes) => {
    if (validation.value == "minLength") {
      setIsMinLength(!isMinLength);
    } else if (validation.value == "maxLength") {
      setIsMaxLength(!isMaxLength);
    }
  };

  const handleValidationToggle = (
    validationType: ValidationType,
    checked: boolean
  ) => {
    if (!selectedField) return;

    const validations = selectedField.validations || [];

    if (checked) {
      updateField(selectedField.id, {
        validations: [
          ...validations,
          {
            type: validationType,
            value: "",
            message: setErrorMessage(validationType),
          },
        ],
      });
    } else {
      updateField(selectedField.id, {
        validations: validations.filter((v) => v.type !== validationType),
      });
    }
  };

  // Handle validation input values base on the type
  const handleValidationInputValues = (
    type: "minLength" | "maxLength",
    selectedField: FormField,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const validations = selectedField.validations || [];
    const updatedValidations = validations.map((v) => {
      if (v.type === type) {
        return { ...v, value: e.target.value };
      }
      return v;
    });

    updateField(selectedField.id, {
      validations: updatedValidations,
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-blue-400">
            Dynamic Form Builder
          </h1>
          <p className="mt-2 text-slate-400">
            Create custom forms with various field types and validations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Field Types Panel */}
          <FieldTypesPanel
            FIELD_TYPES={FIELD_TYPES}
            onAddField={handleAddFieldClick}
          />

          {/* Form Fields List */}
          <FormFieldsList
            fields={fields}
            formName={formName}
            setFormName={setFormName}
            saveForm={saveForm}
            setSelectedField={setSelectedField}
            selectedField={selectedField}
            moveField={moveField}
            removeField={removeField}
          />

          {/* Field Configuration */}
          <FieldConfigurationPanel
            selectedField={selectedField}
            fields={fields}
            updateField={updateField}
            VALIDATION_TYPES={VALIDATION_TYPES}
            openValidationInput={openValidationInput}
            isMinLength={isMinLength}
            isMaxLength={isMaxLength}
            handleValidationToggle={handleValidationToggle}
            handleValidationInputValues={handleValidationInputValues}
            isDerived={isDerived}
            setIsDerived={setIsDerived}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateForm;