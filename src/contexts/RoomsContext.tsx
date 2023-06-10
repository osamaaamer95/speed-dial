import React, { useState, useEffect } from "react";
import { LocalStorage } from "@raycast/api";
import { Room } from "../types";

type RoomContextType = {
  rooms: Room[];
  loading: boolean;
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  addRoom: (room: Room) => Promise<void>;
  editRoomName: (room: Room) => Promise<void>;
  removeRoom: (room: Room) => Promise<void>;
};

const RoomContext = React.createContext<RoomContextType | undefined>(undefined);

type RoomProviderProps = {
  children: React.ReactNode;
};

const RoomProvider = ({ children }: RoomProviderProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    async function getRooms() {
      const rooms = await LocalStorage.getItem<string>("rooms");
      setRooms(JSON.parse(rooms ?? "[]") as Room[]);
    }
    getRooms().then(() => {
      setLoading(false);
    });
  }, []);

  const addRoom = async (room: Room) => {
    const newRooms = [...rooms, room];
    setRooms(newRooms);
    await LocalStorage.setItem("rooms", JSON.stringify(newRooms));
  };

  const editRoomName = async (room: Room) => {
    const newRooms = rooms.map((item) => {
      if (item.url === room.url) {
        return {
          ...item,
          name: room.name,
        };
      }
      return item;
    });
    setRooms(newRooms);
    await LocalStorage.setItem("rooms", JSON.stringify(newRooms));
  };

  const removeRoom = async (room: Room) => {
    const newRooms = rooms.filter((item) => item.url !== room.url);
    setRooms(newRooms);
    await LocalStorage.setItem("rooms", JSON.stringify(newRooms));
  };

  return (
    <RoomContext.Provider value={{ loading, rooms, setRooms, addRoom, editRoomName, removeRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

export { RoomContext, RoomProvider };
