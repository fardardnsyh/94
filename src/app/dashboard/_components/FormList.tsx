"use client";

import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import FormListItem from "./FormListItem";
import { db } from "../../../../configs";
import { JsonForms } from "../../../../configs/schema";

type FormRecord = {
  id: string;
  createdBy: string;
  jsonform: string;
};

const FormList: React.FC = () => {
  const { user } = useUser();
  const [formList, setFormList] = useState<FormRecord[]>([]);

  useEffect(() => {
    if (user) {
      GetFormList();
    }
  }, [user]);

  const GetFormList = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const result = await db
      .select()
      .from(JsonForms)
      .where(eq(JsonForms.createdBy, user.primaryEmailAddress.emailAddress))
      .orderBy(desc(JsonForms.id));

    setFormList(result.map((item) => ({ ...item, id: item.id.toString() })));
    console.log(result);
  };

  return (
    <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-5">
      {formList.map((form, index) => (
        <div key={form.id}>
          <FormListItem
            jsonForm={JSON.parse(form.jsonform)}
            formRecord={form}
            refreshData={GetFormList}
          />
        </div>
      ))}
    </div>
  );
};

export default FormList;
