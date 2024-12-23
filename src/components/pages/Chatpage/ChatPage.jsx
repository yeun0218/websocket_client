import React, { useEffect, useState } from 'react'
import socket from "../../../server.js";
import { Button } from "@mui/base/Button"
import MessageContainer from "../../MessageContainer/MessageContainer";
import InputField from "../../InputField/InputField";
import './chatPageStyle.css'
import { useNavigate } from 'react-router-dom';

const ChatPage = ({user}) => {
    const [messageList, setMessageList] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate()
    
    useEffect(() => {
      socket.on("message", (res) => {
        console.log("message",res)
        setMessageList((prevState) => prevState.concat(res));
      });

    }, []);

    const leaveRoom=()=>{
      socket.emit("leaveRoom",user,(res)=>{
          if(res.ok) navigate("/") // 다시 채팅방 리스트 페이지로 돌아감
      })
    }
  
    const sendMessage = (event) => {
      event.preventDefault();
      socket.emit("sendMessage", message, (res) => {
        if (!res.ok) {
          console.log("error message", res.error);
        }
        setMessage("");
      });
    };

    return (
      <div>
        <div className="App">
        <nav>
              <Button onClick={leaveRoom}className='back-button'>←</Button>
              <div className='nav-user'>{user.name}</div>
            </nav>
          <div>
            {messageList.length > 0 ? (
              <MessageContainer messageList={messageList} user={user} />
            ) : null}
          </div>
          <InputField
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    );
}

export default ChatPage