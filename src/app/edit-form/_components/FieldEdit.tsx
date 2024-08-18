import { Edit, Trash } from "lucide-react";
import React, { useState } from "react";
import { Field } from "./FormFields";
import { useToast } from "@/components/ui/use-toast";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type FieldEditProps = {
  defaultValue: Field;
  onUpdate: (updatedField: Field) => void;
  deleteField: () => void;
};

const FieldEdit: React.FC<FieldEditProps> = ({
  defaultValue,
  onUpdate,
  deleteField,
}) => {
  const [label, setLabel] = useState<string>(defaultValue.label);
  const [placeholder, setPlaceholder] = useState<string | undefined>(
    defaultValue.placeholder
  );
  const { toast } = useToast();
  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger>
          <Edit className="h-5 w-4" />
        </PopoverTrigger>
        <PopoverContent>
          <h2>Edit field</h2>
          <div>
            <Label>Label Name</Label>
            <Input
              type="text"
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
              }}
            />
          </div>
          {defaultValue.fieldType !== "checkbox" &&
            defaultValue.fieldType !== "radio" && (
              <div>
                <Label>Placeholder</Label>
                <Input
                  type="text"
                  value={placeholder}
                  onChange={(e) => {
                    setPlaceholder(e.target.value);
                  }}
                />
              </div>
            )}
          <Button
            size="sm"
            className="mt-2 text-white"
            onClick={() =>
              onUpdate({
                ...defaultValue,
                label: label,
                placeholder: placeholder,
              })
            }
          >
            Update
          </Button>
        </PopoverContent>
      </Popover>

      <AlertDialog>
        <AlertDialogTrigger>
          <Trash className="h-5 w-4 text-red-500" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="text-white bg-gradient-to-r dark:from-red-600 dark:to-pink-700 dark:bg-gradient-to-r from-red-500 to-pink-600 transition-all"
              onClick={deleteField}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FieldEdit;
