import CreateForm from "@/components/createForm";
import { Button } from "@/components/ui/button";
import React from "react";
import FormList from "./_components/FormList";

function page() {
  return (
    <div className="p-5">
      <h2 className="font-bold text-3xl flex justify-between">
        Dashboard
        <CreateForm />
      </h2>
      <FormList />
    </div>
  );
}

export default page;
