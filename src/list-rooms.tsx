import RoomsList from "./ListRooms/RoomsList";
import { RoomProvider } from "./RoomsContext";

export default function Command() {
  return (
    <RoomProvider>
      <RoomsList />
    </RoomProvider>
  );
}
