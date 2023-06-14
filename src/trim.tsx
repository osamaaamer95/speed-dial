import { RoomProvider } from "./contexts/RoomsContext";
import ListOutdatedRooms from "./components/ListOutdatedRooms";

export default function Command() {
  return (
    <RoomProvider>
      <ListOutdatedRooms />
    </RoomProvider>
  );
}
