import { ActionPanel, Action, List, Icon, showToast, Toast, confirmAlert } from "@raycast/api";

import { RoomContext } from "../contexts/RoomsContext";
import { useContext } from "react";
import { AppIcons, SupportedApps } from "../types";

export default function ListOutdatedRooms() {
  const roomContext = useContext(RoomContext);

  if (!roomContext) {
    throw new Error("ListRooms must be used within a RoomProvider");
  }

  const { outdatedRooms, removeRoom, removeOutdatedRooms, loading } = roomContext;

  return (
    <List isLoading={loading} searchBarPlaceholder="Search rooms">
      {outdatedRooms().map((item) => (
        <List.Item
          key={item.url}
          icon={item.icon === AppIcons.Generic ? Icon.Person : { source: `icons/${item.icon}` }}
          title={item.name}
          subtitle={item.app !== SupportedApps.Generic ? undefined : item.url}
          accessories={[{ text: item.app }]}
          actions={
            <ActionPanel>
              <Action
                title="Remove"
                icon={Icon.Trash}
                shortcut={{ modifiers: ["cmd"], key: "backspace" }}
                onAction={async () => {
                  if (await confirmAlert({ title: "Are you sure?" })) {
                    removeRoom(item)?.then(() => {
                      showToast({
                        style: Toast.Style.Success,
                        title: "Yay!",
                        message: `${item.name} removed`,
                      });
                    });
                  }
                }}
              />
              <Action
                title="Remove All"
                icon={Icon.Trash}
                shortcut={{ modifiers: ["cmd", "shift"], key: "backspace" }}
                onAction={async () => {
                  if (await confirmAlert({ title: "Remove all outdated rooms?" })) {
                    removeOutdatedRooms()?.then(() => {
                      showToast({
                        style: Toast.Style.Success,
                        title: "Yay!",
                        message: `Outdated rooms removed`,
                      });
                    });
                  }
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
