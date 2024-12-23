import { useEffect, useState } from "react";
import "./App.css";
import socket from "./server";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ChatPage from "./components/pages/Chatpage/ChatPage.jsx";
import LoginPage from "./components/pages/LoginPage.js";
import RoomListPage from "./components/pages/RoomListPage/RoomListPage.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [messageList, setMessageList] = useState([]); // 메시지 전체 저장
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // BE에서 메시지를 받아오는 리스너 등록
    socket.on("message", (message) => {
      if (message && typeof message === "object" && message.message) {
        setMessageList((prevState) => [...prevState, message]);
      } else {
        console.error("Invalid message format:", message);
      }
    });

    socket.on("rooms", (res) => {
      setRooms(res);
    });

    // 소켓 리스너 해제
    return () => socket.off("message");
  }, []);

  const handleCustomerLogin = (customerData) => {
    setUser({...customerData, type:"customer"});
    navigate("/chat");
  };

  const handleBranchLogin = (branchData) => {
    setUser({ ...branchData, type: "branch" });
    navigate("/chat");
  };

  return (
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <LoginPage
                onCustomerLogin={handleCustomerLogin}
                onBranchLogin={handleBranchLogin}
              />
            }
          />
          <Route exact path="/rooms" element={<RoomListPage rooms={rooms} />} />
          <Route
            path="/chat/:roomId"
            element={<ChatPage user={user} messageList={messageList} />}
          />
        </Routes>
      </div>
  );
}

export default App;
