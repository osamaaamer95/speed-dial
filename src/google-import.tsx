import { List, Detail, Toast, showToast, Icon } from "@raycast/api";
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
    <List isLoading={isLoading}>
      {items.map((item) => {
        return <List.Item key={item.id} id={item.id} icon={Icon.TextDocument} title={item.summary} />;
      })}
    </List>
  );
}
