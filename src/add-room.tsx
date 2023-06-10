import { RoomProvider } from "./RoomsContext";
import AddRoom from "./AddRoom/AddRoom";

export default function Command() {
  return (
    <RoomProvider>
      <AddRoom />
    </RoomProvider>
  );
}
