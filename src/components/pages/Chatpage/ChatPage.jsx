import React, { useEffect, useState } from "react";
import socket from "../../../server.js";
import { useLocation } from "react-router-dom";

function ChatPage() {
  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const user = location.state?.user; // 로그인된 사용자 정보
  

  useEffect(() => {
    console.log("ChatPage mounted. User:", user);

    if (!user) {
      return <div>로딩 중...</div>;
    }

    if (!user || !user.customer_tel) {
      console.error("Invalid user data:", user);
      return ;
    }
    // 자동 방 연결
    const branchCode = "B004"; // 지점 코드 하드코딩
    socket.emit("startChatWithBranch", { customerTel: user.customer_tel, branchCode }, (response) => {
      if (!response.ok) {
        console.error("Failed to start chat with branch:", response.message);
      }
    });

    // 메시지 리스너 등록
    socket.on("message", (newMessage) => {
      setMessageList((prev) => [...prev, newMessage]);
    });

    return () => socket.off("message");

  }, [user]);

  const sendMessage = () => {
    if (!user || !user.customer_tel) {
      console.error("Cannot send message: user or customerTel is invalid.");
      return;
    }
    
    if (!message.trim()) {
      console.error("Cannot send message: message is empty.");
      return;
    }
  

    socket.emit("sendMessage", {
      message,
      sender_tel: user.customer_tel,
      sender_type: "customer",
    }, (response) => {
      if (response.ok) {
        setMessageList((prev) => [...prev, response.data]);
      } else {
        console.error("Message send failed:", response.error);
      }
    });

    setMessage("");
  };

  return (
    <div>
      <h2>성수점과 채팅</h2>
      <div>
        {messageList.map((msg, index) => (
          <div key={index}>{msg.message}</div>
        ))}
      </div>
      <input
        type="text"
        placeholder="메시지 입력"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
}

export default ChatPage;
