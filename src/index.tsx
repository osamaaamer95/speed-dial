import { ActionPanel, Action, List, LocalStorage, Icon, confirmAlert } from "@raycast/api";
import { useEffect, useState } from "react";
import { MeetingRoom } from "./interfaces";
import { AppIcon } from "./enums";

import AddRoom from "./form";

export default function Command() {
  const [rooms, setRooms] = useState<MeetingRoom[]>([]);

  useEffect(() => {
    async function getContacts() {
      const contacts = await LocalStorage.getItem<string>("rooms");
      setRooms(JSON.parse(contacts ?? "[]"));
    }
    getContacts();
  }, []);

  async function removeContact(value: MeetingRoom) {
    if (await confirmAlert({ title: "Are you sure?" })) {
      const newContacts = rooms.filter((item) => item.url !== value.url);
      setRooms(newContacts);
      await LocalStorage.setItem("contacts", JSON.stringify(newContacts));
    }
  }

  return (
    <List
      actions={
        <ActionPanel>
          <Action.Push title="Add Room" target={<AddRoom />} />
        </ActionPanel>
      }
    >
      {rooms.map((item) => (
        <List.Item
          key={item.url}
          icon={item.icon === AppIcon.Generic ? Icon.Person : { source: `icons/${item.icon}` }}
          title={item.name}
          accessories={[{ text: item.app }]}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={item.url} />
              <Action.CopyToClipboard content={item.url} />
              <Action
                title="Remove"
                icon={Icon.Trash}
                shortcut={{ modifiers: ["cmd"], key: "backspace" }}
                onAction={() => removeContact(item)}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
