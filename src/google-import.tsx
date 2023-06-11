import { RoomProvider } from "./contexts/RoomsContext";
import ListCalendars from "./components/ListCalendars";

export default function Command() {
  return (
    <RoomProvider>
      <ListCalendars />
    </RoomProvider>
  );
}
