import React, { useEffect, useState } from "react";
import socket from "../../../server.js";
import { useNavigate } from "react-router-dom";
import "./RoomListPageStyle.css";

const RoomListPage = ({ user }) => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.customerTel) {
      console.error("customerTel is not defined");
      return;
  }

  socket.emit("joinRoom", user.customerTel, (response) => {
      if (response.ok) {
          setRooms(response.data);
      } else {
          console.error("Failed to join room:", response.error);
      }
  });
}, [user]);

  const handleRoomClick = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  const handleCreateRoom = () => {
    const customerTel = prompt("고객 연락처를 입력하세요");
    if (!customerTel) return;

    if (!user || user.type !== "branch") {
        console.error("Branch information is missing");
        return;
    }

    const branchCode = user.branchCode;

    socket.emit("createRoom", { branchCode, customerTel }, (response) => {
        if (response.ok) {
            setRooms((prevRooms) => [...prevRooms, response.data]); // 새 방 추가
        } else {
            console.error("Failed to create room:", response.error);
        }
    });
};

  return (
    <div className="room-body">
      <div className="room-nav">채팅 ▼</div>

      {user && user.type === "customer" && (
        <button onClick={handleCreateRoom} className="create-room-button">
          새 방 생성
        </button>
      )}

      {rooms.length > 0 ? (
        rooms.map((room) => (
          <div
            className="room-list"
            key={room._id}
            onClick={() => handleRoomClick(room._id)}
          >
            <div className="room-title">
              <img src="/profile.jpeg" alt="profile" />
              <p>{room.customerName || "Unknown"}</p>
            </div>
            <div className="member-number">{room.memberCount || 1}</div>
          </div>
        ))
      ) : (
        <p>현재 채팅 방이 없습니다.</p>
      )}
    </div>
  );
};

export default RoomListPage;
