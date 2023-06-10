import { useEffect, useState } from "react";
import { Action, ActionPanel, Form, LocalStorage, Toast, popToRoot, showToast } from "@raycast/api";
import { useForm, FormValidation } from "@raycast/utils";

import { MeetingRoom } from "./interfaces";
import { AppIcon } from "./enums";

export default function AddRoom() {
  const [rooms, setRooms] = useState<MeetingRoom[]>([]);
  const [detectedApp, setDetectedApp] = useState<{
    app: string;
    icon: AppIcon;
  }>();

  // get contacts from local storage
  useEffect(() => {
    async function getContacts() {
      const contacts = await LocalStorage.getItem<string>("contacts");
      setRooms(JSON.parse(contacts ?? "[]"));
    }
    getContacts();
  }, []);

  const { handleSubmit, itemProps } = useForm<MeetingRoom>({
    onSubmit(values) {
      LocalStorage.setItem(
        "rooms",
        JSON.stringify([
          ...rooms,
          {
            ...values,
            icon: detectedApp?.icon ?? AppIcon.Generic,
            app: detectedApp?.app ?? "Generic",
          },
        ])
      );
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

  const detectApp = (event: Form.Event<string>) => {
    const url = event.target.value;
    if (!url) {
      setDetectedApp(undefined);
      return;
    }
    if (isZoomLink(url)) {
      setDetectedApp({ app: "Zoom", icon: AppIcon.Zoom });
    } else if (isMeetLink(url)) {
      setDetectedApp({ app: "Google Meet", icon: AppIcon.Meet });
    } else if (isTeamsLink(url)) {
      setDetectedApp({ app: "Microsoft Teams", icon: AppIcon.Teams });
    } else {
      setDetectedApp(undefined);
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Add Room" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField title="Meeting URL" placeholder="Enter meeting URL" {...itemProps.url} onBlur={detectApp} />
      <Form.Separator />
      <Form.TextField title="Meeting Room Name" placeholder="1-1 w/ James, Sales Standup..." {...itemProps.name} />
      {detectedApp && <Form.Description title="App" text={`${detectedApp.app}`} />}
    </Form>
  );
}

const isValidUrl = (urlString: string) => {
  const urlPattern = new RegExp(/^(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+$/g);
  return !!urlPattern.test(urlString);
};

const isZoomLink = (urlString: string) => {
  const zoomPattern = new RegExp(/https:\/\/[\w-]*\.?zoom.us\/(j|my)\/[\d\w?=-]+/g);
  return !!zoomPattern.test(urlString);
};

const isTeamsLink = (urlString: string) => {
  const teamsPattern = new RegExp(/https:\/\/teams.microsoft.com\/l\/meetup-join\/[\d\w?=-]+/g);
  return !!teamsPattern.test(urlString);
};

const isMeetLink = (urlString: string) => {
  const meetPattern = new RegExp(/https:\/\/meet.google.com\/[\d\w?=-]+/g);
  return !!meetPattern.test(urlString);
};
