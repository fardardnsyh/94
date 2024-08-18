import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import FieldEdit from "./FieldEdit";
import { Button } from "@/components/ui/button";

export type Option = {
  value: string;
  label: string;
};

export type Field = {
  label: string;
  fieldTitle: string;
  fieldType:
    | "text"
    | "email"
    | "select"
    | "textarea"
    | "radio"
    | "checkbox"
    | "number"
    | "file"
    | "tel"
    | "date";
  placeholder?: string;
  required: boolean;
  options?: Option[];
};

export type JsonForm = {
  formTitle: string;
  title: string;
  subheading: string;
  fields: Field[];
};

type FormFieldsProps = {
  jsonForm?: JsonForm | null;
  onFieldUpdate?: (value: Field, index: number) => void;
  deleteField?: (index: number) => void;
  editable?: boolean;
};

const FormFields: React.FC<FormFieldsProps> = ({
  jsonForm,
  deleteField,
  onFieldUpdate,
  editable = true,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      const fileArray = Array.from(files);
      setFormData((prev) => ({ ...prev, [name]: fileArray }));
    }
  };

  const handleCheckboxChange = (
    fieldTitle: string,
    optionName: string,
    isChecked: string | boolean
  ) => {
    const currentList = formData[fieldTitle] || [];
    const updatedList = Boolean(isChecked)
      ? [...currentList, { label: optionName, value: optionName }]
      : currentList.filter(
          (option: { label: string }) => option.label !== optionName
        );

    setFormData((prev) => ({ ...prev, [fieldTitle]: updatedList }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    // Add further form submission logic here
  };

  if (!jsonForm) {
    return <div>Loading form...</div>;
  }

  const { title, formTitle, subheading, fields } = jsonForm;

  return (
    <form
      onSubmit={handleSubmit}
      className="border px-10 py-10 my-10 h-fit lg:w-[600px] md:w-[450px] bg-white text-gray-700 rounded-lg shadow-xl"
    >
      <h2 className="font-bold text-center text-2xl">{title || formTitle}</h2>
      <h3 className="text-lg text-center">{subheading}</h3>
      {fields.map((field, index) => {
        const { label, fieldTitle, fieldType, placeholder, required, options } =
          field;

        return (
          <div key={index} className="my-3 flex flex-col items-end w-full">
            <Label
              htmlFor={fieldTitle}
              className="text-xs dark:text-gray-700 w-full"
            >
              {label}
            </Label>
            {editable && (
              <div>
                <FieldEdit
                  defaultValue={field}
                  deleteField={() => deleteField && deleteField(index)}
                  onUpdate={(value) =>
                    onFieldUpdate && onFieldUpdate(value, index)
                  }
                />
              </div>
            )}
            {fieldType === "text" || fieldType === "email" ? (
              <Input
                className="text-gray-700 w-full"
                type={fieldType}
                id={fieldTitle}
                name={fieldTitle}
                placeholder={placeholder}
                required={required}
                onChange={handleInputChange}
              />
            ) : fieldType === "select" ? (
              <div className="w-full">
                <Select>
                  <SelectTrigger className="w-full placeholder:text-gray-700">
                    <SelectValue placeholder={fieldTitle} />
                  </SelectTrigger>
                  <SelectContent>
                    {options?.map((option, idx) => (
                      <SelectItem key={idx} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : fieldType === "radio" ? (
              <RadioGroup className="my-3 w-full">
                {options?.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            ) : fieldType === "textarea" ? (
              <Textarea
                className="text-gray-700 w-full"
                id={fieldTitle}
                name={fieldTitle}
                placeholder={placeholder}
                required={required}
                onChange={handleInputChange}
              />
            ) : fieldType === "checkbox" ? (
              <div className="my-3 w-full">
                <label className="text-xs text-gray-500">{label}</label>
                {options ? (
                  options.map((option, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Checkbox
                        onCheckedChange={(v) =>
                          handleCheckboxChange(fieldTitle, option.label, v)
                        }
                      />
                      <h2>{option.label}</h2>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-2">
                    <Checkbox id={fieldTitle} />
                    <Label htmlFor={fieldTitle}>{label}</Label>
                  </div>
                )}
              </div>
            ) : fieldType === "number" ||
              fieldType === "tel" ||
              fieldType === "date" ? (
              <Input
                className="w-full text-gray-700"
                type={fieldType}
                id={fieldTitle}
                name={fieldTitle}
                placeholder={placeholder}
                required={required}
                onChange={handleInputChange}
              />
            ) : fieldType === "file" ? (
              <Input
                className="w-full text-gray-700 bg-gray-300"
                type="file"
                id={fieldTitle}
                name={fieldTitle}
                required={required}
                onChange={handleFileChange}
              />
            ) : (
              <div className="my-3 w-full">
                <label className="text-xs text-gray-500">{label}</label>
                <Input
                  type={fieldType}
                  placeholder={placeholder}
                  name={fieldTitle}
                  className="bg-transparent"
                  required={required}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>
        );
      })}
      <div className="w-full flex justify-end">
        <Button
          type="submit"
          className="w-1/5 mt-2 justify-center text-white bg-gradient-to-r from-cyan-500 to-indigo-500"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default FormFields;
