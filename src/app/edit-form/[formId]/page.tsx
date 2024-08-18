"use client";

import { db } from "../../../../configs";
import { JsonForms } from "../../../../configs/schema";
import { and, eq } from "drizzle-orm";
import { useUser } from "@clerk/clerk-react";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Share2, SquareArrowOutUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/app/(dashboard)/header";
import FormFields from "../_components/FormFields";
import { toast } from "sonner";
import Controller from "../_components/Controller";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RWebShare } from "react-web-share";

type FormData = {
  id: number;
  jsonform: string;
  createdBy: string;
  createdAt: string;
};

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
  formHeading: string;
  formTitle: string;
  title: string;
  subheading: string;
  fields: Field[];
};

function Page({ params }: { params: { formId: number } }): React.JSX.Element {
  const { user } = useUser();

  const [record, setRecord] = useState<FormData | null>(null);
  const [jsonForm, setJsonForm] = useState<JsonForm | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const deleteField = (indexToRemove: number) => {
    if (jsonForm) {
      const updatedFields = jsonForm.fields.filter(
        (_, index) => index !== indexToRemove
      );
      const updatedForm = { ...jsonForm, fields: updatedFields };
      setJsonForm(updatedForm);
      updateJsonFormDb(updatedForm);
    }
    toast("Field deleted");
  };

  const updateJsonFormDb = useCallback(
    async (updatedForm: JsonForm) => {
      try {
        await db
          .update(JsonForms)
          .set({ jsonform: JSON.stringify(updatedForm) })
          .where(eq(JsonForms.id, Number(params.formId)));
      } catch (err) {
        console.error("Failed to update form data:", err);
      }
    },
    [params.formId]
  );

  const onFieldUpdate = (value: Field, index: number) => {
    if (jsonForm) {
      const updatedFields = [...jsonForm.fields];
      updatedFields[index] = value;
      const updatedForm = { ...jsonForm, fields: updatedFields };
      setJsonForm(updatedForm);
      updateJsonFormDb(updatedForm);
    }
    toast("Field updated!!!");
  };

  const getFormData = useCallback(async () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      try {
        const result = await db
          .select()
          .from(JsonForms)
          .where(
            and(
              eq(JsonForms.id, Number(params?.formId)),
              eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
            )
          );

        if (result.length > 0) {
          setRecord(result[0]);
          const jsonformString = result[0].jsonform;
          try {
            const parsedFormData: JsonForm = JSON.parse(jsonformString);
            setJsonForm(parsedFormData);
          } catch (jsonParseError) {
            console.error("Error parsing JSON form:", jsonParseError);
            setError("Invalid JSON format in form data");
          }
        } else {
          setError("No form data found");
        }
      } catch (err) {
        setError("Failed to fetch form data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [params?.formId, user?.primaryEmailAddress?.emailAddress]);

  useEffect(() => {
    if (user) {
      getFormData();
    }
  }, [user, getFormData]);

  return (
    <div>
      <Header />
      <div className="px-5 pb-5">
        <div className="flex justify-between items-center">
          <h2
            className="flex gap-2 items-center my-5 cursor-pointer
        hover:font-bold "
            onClick={() => router.back()}
          >
            <ArrowLeft /> Back
          </h2>
          <div className="flex gap-2">
            <Link href={"/aiform/" + record?.id} target="_blank">
              <Button className="flex gap-2 text-white">
                <SquareArrowOutUpRight className="h-4 w-4" /> Live Preview
              </Button>
            </Link>
            <RWebShare
              data={{
                text:
                  jsonForm?.formHeading +
                  " , Build your form in seconds with AI form Builder ",
                url: process.env.NEXT_PUBLIC_BASE_URL + "/aiform/" + record?.id,
                title: jsonForm?.formTitle,
              }}
              onClick={() => console.log("shared successfully!")}
            >
              <Button className="flex gap-2 text-white">
                <Share2 className="h-4 w-4" /> Share
              </Button>
            </RWebShare>
          </div>
        </div>
        <div className="grid grid-cols-1  md:grid-cols-1 gap-5">
          {/* <div className="p-5 border rounded-lg shadow-md">
            <Controller />
          </div> */}
          <div
            className="md:col-span-2 border rounded-lg p-5 
             flex items-center justify-center"
          >
            <FormFields
              jsonForm={jsonForm}
              onFieldUpdate={onFieldUpdate}
              deleteField={(index) => deleteField(index)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
