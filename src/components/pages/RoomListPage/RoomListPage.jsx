import React, { useEffect, useState } from "react";
import socket from "../../../server.js";
import { useNavigate } from "react-router-dom";
import "./RoomListPageStyle.css";

const RoomListPage = ({user}) => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.type === "branch") {
      socket.emit("getRooms", user.branchCode, (response) => {
        if (response.ok) {
          setRooms(response.data);
        } else {
          console.error("Failed to fetch rooms:", response.message);
        }
      });
    }
  }, [user]);

  const handleRoomClick = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  return (
    <div className="room-body">
      <div className="room-nav">채팅 ▼</div>

      {rooms.length > 0
        ? rooms.map((room) => (
            <div
              className="room-list"
              key={room._id}
              onClick={() => handleRoomClick(room._id)}
            >
              <div className="room-title">
                <img src="/profile.jpeg" />
                <p>{room.name}</p>
              </div>
              <div className="member-number">{room.memberCount}</div>
            </div>
          ))
        : (
            <p>현재 채팅 방이 없습니다.</p>
        )}
    </div>
  );
};

export default RoomListPage;