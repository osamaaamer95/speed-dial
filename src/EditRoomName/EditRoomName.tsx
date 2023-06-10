import { useContext } from "react";
import { Action, ActionPanel, Form, Toast, showToast, useNavigation } from "@raycast/api";
import { useForm, FormValidation } from "@raycast/utils";

import { RoomContext } from "../RoomsContext";
import { Room } from "../types";

export default function EditRoom(props: { room: Room }) {
  const roomContext = useContext(RoomContext);

  if (!roomContext) {
    throw new Error("Command must be used within a RoomProvider");
  }

  const { editRoomName } = roomContext;
  const { room } = props;

  const { pop } = useNavigation();

  const { handleSubmit, itemProps } = useForm<Room>({
    initialValues: room,
    onSubmit(values) {
      // edit name
      editRoomName(values);

      showToast({
        style: Toast.Style.Success,
        title: "Yay!",
        message: `${values.name} edited`,
      });

      pop();
    },
    validation: {
      name: FormValidation.Required,
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Edit" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField title="Meeting Room Name" placeholder="1-1 w/ James, Sales Standup..." {...itemProps.name} />
    </Form>
  );
}
