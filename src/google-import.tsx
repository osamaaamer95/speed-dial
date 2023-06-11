import { List, Detail, Toast, showToast, Icon, ActionPanel, Action } from "@raycast/api";
import { useState, useEffect } from "react";
import * as google from "./utils/google";
import { Calendar } from "./types";

export default function Command() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [items, setItems] = useState<Calendar[]>([]);

  useEffect(() => {
    (async () => {
      try {
        await google.authorize();
        const fetchedItems = await google.fetchCalendars();
        setItems(fetchedItems);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        showToast({ style: Toast.Style.Failure, title: String(error) });
      }
    })();
  }, []);

  if (isLoading) {
    return <Detail isLoading={isLoading} />;
  }

  return (
    <List
      isLoading={isLoading}
      isShowingDetail
      actions={
        <ActionPanel>
          <Action
            title="Logout"
            onAction={() => google.logout()}
            icon={Icon.Logout}
            shortcut={{ modifiers: ["cmd"], key: "backspace" }}
          />
        </ActionPanel>
      }
    >
      {items
        .sort((item) => {
          // bring the primary calendar to the top
          if (item.primary) {
            return -1;
          }
          return 0;
        })
        .map((item) => {
          return (
            <List.Item
              key={item.id}
              id={item.id}
              icon={{ source: Icon.CircleFilled, tintColor: item.backgroundColor }}
              title={`${item.summaryOverride || item.summary} ${item.primary ? "(Primary)" : ""}`}
              detail={
                <List.Item.Detail
                  metadata={
                    <List.Item.Detail.Metadata>
                      <List.Item.Detail.Metadata.Label title="ID" text={item.id} />
                      <List.Item.Detail.Metadata.Separator />
                      <List.Item.Detail.Metadata.Label
                        title="Description"
                        text={item.description || "No description"}
                      />
                      <List.Item.Detail.Metadata.Separator />
                      <List.Item.Detail.Metadata.Label title="Timezone" text={item.timeZone} />
                      <List.Item.Detail.Metadata.Label title="Primary" text={item.primary ? "Yes" : "No"} />
                      <List.Item.Detail.Metadata.Label
                        title="Read Only?"
                        text={item.accessRole === "reader" ? "Yes" : "No"}
                      />
                    </List.Item.Detail.Metadata>
                  }
                ></List.Item.Detail>
              }
            ></List.Item>
          );
        })}
    </List>
  );
}
