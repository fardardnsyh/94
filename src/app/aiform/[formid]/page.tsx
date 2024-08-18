"use client";
import { eq } from "drizzle-orm";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { db } from "../../../../configs";
import { JsonForms } from "../../../../configs/schema";
import FormFields from "@/app/edit-form/_components/FormFields";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type JsonForm = {
  formTitle: string;
  title: string;
  subheading: string;
  fields: {
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
    options?: {
      value: string;
      label: string;
    }[];
  }[];
};

type Record = {
  id: number;
  jsonform: string;
  background?: string;
};

type Props = {
  params: {
    formid: number;
  };
};

const LiveAiForm: React.FC<Props> = ({ params }) => {
  const [record, setRecord] = useState<Record | null>(null);
  const [jsonForm, setJsonForm] = useState<JsonForm | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (params) {
      GetFormData();
    }
  }, [params]);

  const GetFormData = async () => {
    const result = await db
      .select()
      .from(JsonForms)
      .where(eq(JsonForms.id, Number(params?.formid)));

    if (result.length > 0) {
      setRecord(result[0]);
      setJsonForm(JSON.parse(result[0].jsonform));
    }
  };

  return (
    <div className="p-10 flex  justify-center items-center row-span-2">
      {record && jsonForm && (
        <FormFields
          jsonForm={jsonForm}
          onFieldUpdate={() => console.log}
          deleteField={() => console.log}
          editable={false}
        />
      )}
      <Link
        className="flex gap-2 items-center bg-black text-white px-3 py-1 rounded-full fixed bottom-5 left-5 cursor-pointer"
        href={"/"}
      >
        Build your Own AI form
      </Link>
    </div>
  );
};

export default LiveAiForm;
