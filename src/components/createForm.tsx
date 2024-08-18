"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { AIChatSession } from "../../configs/AIModel";
import { useUser } from "@clerk/clerk-react";
import { JsonForms } from "../../configs/schema";
import { db } from "../../configs";
import moment from "moment";
import { useRouter } from "next/navigation";

function CreateForm() {
  const PROMPT =
    ", On the basis of description give me a form only in strict json format no explaination with Form title, form subheading, placeholders for each field , form label,FieldTitle, fieldType,(if fieldtype === select give label and value) field required in json format(nothing other than json format and no explainations) also remove anything which is not in json format from front and end please remove (```) from the result never show it";
  const [openDialog, setOpenDialog] = useState(false);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUser() || {};
  const route = useRouter();
  const onCreate = async () => {
    try {
      console.log(userInput);
      setLoading(true);
      const result = await AIChatSession.sendMessage(
        "Description:" + userInput + PROMPT
      );
      const responseText = await result.response.text();
      console.log(responseText);

      if (responseText) {
        const emailAddress = user?.primaryEmailAddress?.emailAddress;
        if (!emailAddress) {
          throw new Error("User email address is required.");
        }
        const resp = await db
          .insert(JsonForms)
          .values({
            jsonform: responseText,
            createdBy: emailAddress,
            createdAt: moment().format("DD/MM/yyyy"),
          })
          .returning({ id: JsonForms.id });
        console.log(resp[0].id);
        if (resp[0].id) {
          route.push("/edit-form/" + resp[0].id);
        }
      }
    } catch (error) {
      console.error("Error creating form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={() => {
          setOpenDialog(true);
        }}
        className="bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white"
      >
        Create Form
      </Button>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
            <DialogDescription>
              <Textarea
                onChange={(e) => {
                  setUserInput(e.target.value);
                }}
                className="my-2"
                placeholder="Write a description about your form"
              />
              <div className="flex gap-3 my-3 justify-end">
                <Button
                  disabled={loading}
                  onClick={onCreate}
                  className="w-1/3 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white"
                >
                  {loading ? "Creating..." : "Create"}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateForm;
