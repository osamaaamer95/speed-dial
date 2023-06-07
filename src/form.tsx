import { Action, ActionPanel, Form, LocalStorage, Toast, popToRoot, showToast } from "@raycast/api";
import { useForm, FormValidation } from "@raycast/utils";
import { useEffect, useState } from "react";

import { Contact } from "./interfaces";
import { AppIcon } from "./enums";

export default function AddContact() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const { handleSubmit, itemProps } = useForm<Contact>({
    onSubmit(values) {
      if (values.url.includes("zoom.us")) {
        values.icon = AppIcon.Zoom;
        values.app = "Zoom";
      } else if (values.url.includes("meet.google.com")) {
        values.icon = AppIcon.Meet;
        values.app = "Google Meet";
      } else if (values.url.includes("teams.microsoft.com")) {
        values.icon = AppIcon.Teams;
        values.app = "Microsoft Teams";
      } else {
        values.icon = AppIcon.Generic;
        values.app = "Speed Dial";
      }

      LocalStorage.setItem("contacts", JSON.stringify([...contacts, values]));
      showToast({
        style: Toast.Style.Success,
        title: "Yay!",
        message: `${values.name} added to Speed Dial`,
      });
      popToRoot();
    },
    validation: {
      name: FormValidation.Required,
      url: (value) => {
        if (!value) {
          return "The name is required";
        } else if (!isValidUrl(value)) {
          return "Please enter a valid URL";
        }
      },
    },
  });

  useEffect(() => {
    async function getContacts() {
      const contacts = await LocalStorage.getItem<string>("contacts");
      console.log("contacts", contacts);
      setContacts(JSON.parse(contacts ?? "[]"));
    }
    getContacts();
  }, []);

  return (
    <Form
      enableDrafts
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField title="Full Name" placeholder="Enter contact name" {...itemProps.name} />
      <Form.TextField title="Meeting URL" placeholder="Enter meeting URL" {...itemProps.url} />
    </Form>
  );
}

const isValidUrl = (urlString: string) => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};
