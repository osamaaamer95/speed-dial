import { ActionPanel, Action, List, showToast, Toast, Detail, Icon } from "@raycast/api";

import { useEffect, useState } from "react";
import AddRoom from "./AddRoomForm";
import { Event, FetchColorsResponse } from "../types";
import * as google from "../utils/google";

export default function ListEvents({ calendarId }: { calendarId: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [items, setItems] = useState<Event[]>([]);
  const [colors, setColors] = useState<FetchColorsResponse>();

  useEffect(() => {
    (async () => {
      try {
        await google.authorize();
        const fetchedItems = await google.fetchEvents(calendarId);
        const colors = await google.fetchColors();
        setColors(colors);
        setItems(fetchedItems);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        showToast({ style: Toast.Style.Failure, title: String(error) });
      }
    })();
  }, [calendarId]);

  if (isLoading) {
    return <Detail isLoading={isLoading} />;
  }

  return (
    <List
      isLoading={isLoading}
      isShowingDetail
      actions={
        <ActionPanel>
          <Action.Push title="Add Room" target={<AddRoom />} />
        </ActionPanel>
      }
    >
      {items?.map((item) => {
        console.log({ item });
        return (
          <List.Item
            key={item.id}
            id={item.id}
            icon={{ source: Icon.CircleFilled, tintColor: colors?.event?.[item.colorId]?.background }}
            title={item.summary || "No Title"}
            detail={
              <List.Item.Detail
                metadata={
                  <List.Item.Detail.Metadata>
                    <List.Item.Detail.Metadata.Label title="ID" text={item.id} />
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.Label title="Link" text={item.hangoutLink || item.location} />
                  </List.Item.Detail.Metadata>
                }
              ></List.Item.Detail>
            }
            actions={
              <ActionPanel>
                <Action.Push title="Select" target={<AddRoom />} />
              </ActionPanel>
            }
          ></List.Item>
        );
      })}
    </List>
  );
}
