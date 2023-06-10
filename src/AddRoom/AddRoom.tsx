import { useContext, useState } from "react";
import { Action, ActionPanel, Form, Toast, popToRoot, showToast } from "@raycast/api";
import { useForm, FormValidation } from "@raycast/utils";

import { AppIcons, SupportedApps } from "../enums";
import { RoomContext } from "../RoomsContext";
import { Room } from "../types";

export default function AddRoom() {
  const roomContext = useContext(RoomContext);

  if (!roomContext) {
    throw new Error("Command must be used within a RoomProvider");
  }

  const { addRoom } = roomContext;

  const [detectedApp, setDetectedApp] = useState<{
    app: SupportedApps;
    icon: AppIcons;
  }>();

  const { handleSubmit, itemProps } = useForm<Room>({
    onSubmit(values) {
      // add the room to state and save to local storage
      addRoom({
        ...values,
        icon: detectedApp?.icon ?? AppIcons.Generic,
        app: detectedApp?.app ?? SupportedApps.Generic,
      })
        .then(() => {
          showToast({
            style: Toast.Style.Success,
            title: "Yay!",
            message: `${values.name} added to Speed Dial`,
          });
          popToRoot();
        })
        .catch((err) => {
          console.error(err);
          throw new Error("Error adding room");
        });
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
      setDetectedApp({ app: SupportedApps.Zoom, icon: AppIcons.Zoom });
    } else if (isMeetLink(url)) {
      setDetectedApp({ app: SupportedApps.Meet, icon: AppIcons.Meet });
    } else if (isTeamsLink(url)) {
      setDetectedApp({ app: SupportedApps.Teams, icon: AppIcons.Teams });
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
