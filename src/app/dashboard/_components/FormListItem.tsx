import { Button } from "@/components/ui/button";
import { Edit, Share, Trash } from "lucide-react";
import Link from "next/link";
import React from "react";
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
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { toast } from "sonner";
import { RWebShare } from "react-web-share";
import { JsonForms } from "../../../../configs/schema";
import { db } from "../../../../configs";

type Option = {
  value: string;
  label: string;
};

type Field = {
  label: string;
  fieldTitle: string;
  fieldType:
    | "text"
    | "email"
    | "select"
    | "textarea"
    | "radio"
    | "checkbox"
    | "number";
  placeholder?: string;
  required: boolean;
  options?: Option[];
};

type JsonForm = {
  formTitle: string;
  title: string;
  subheading: string;
  fields: Field[];
};

type FormRecord = {
  id: string;
  createdBy: string;
  // Add other fields as necessary
};

type FormListItemProps = {
  formRecord: FormRecord;
  jsonForm: JsonForm;
  refreshData: () => void;
};

const FormListItem: React.FC<FormListItemProps> = ({
  formRecord,
  jsonForm,
  refreshData,
}) => {
  const { user } = useUser();

  const onDeleteForm = async () => {
    const result = await db
      .delete(JsonForms)
      .where(
        and(
          eq(JsonForms.id, Number(formRecord.id)),
          eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress ?? "")
        )
      );

    if (result) {
      toast("Form Deleted!!!");
      refreshData();
    }
  };

  return (
    <div className="border shadow-sm rounded-lg p-4">
      <div className="flex justify-between">
        <h2></h2>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Trash
              className="h-5 w-5 text-red-600 
                    cursor-pointer hover:scale-105 transition-all"
            />
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
              <AlertDialogAction onClick={() => onDeleteForm()}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <h2 className="text-lg text-black">{jsonForm?.formTitle}</h2>
      <h2 className="text-sm text-gray-500">{jsonForm?.title}</h2>
      <hr className="my-4"></hr>
      <div className="flex justify-between">
        <RWebShare
          data={{
            text:
              jsonForm?.title +
              " , Build your form in seconds with AI form Builder ",
            url: process.env.NEXT_PUBLIC_BASE_URL + "/aiform/" + formRecord?.id,
            title: jsonForm?.formTitle,
          }}
          onClick={() => console.log("shared successfully!")}
        >
          <Button
            variant="outline"
            size="sm"
            className="flex dark:text-white gap-2"
          >
            {" "}
            <Share className="h-5 w-5" /> Share
          </Button>
        </RWebShare>
        <Link href={"/edit-form/" + formRecord?.id}>
          <Button className="flex gap-2 text-white" size="sm">
            <Edit className="h-5 w-5" /> Edit
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FormListItem;
