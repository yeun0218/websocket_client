import React from 'react'
import { Input } from "@mui/base/Input";
import { Button } from "@mui/base/Button";
import './InputField.css'
const InputField = ({message,setMessage,sendMessage}) => {
// 3개의 값을 무조건 넣어줘야 한다

const handleKeyPress = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage(e);
  }
};

  return (
    <div className="input-area">
          <div className="plus-button">+</div>
          <form onSubmit={sendMessage} className="input-container">
            <Input // 유저가 값을 입력하는 
              placeholder="Type in here…"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              multiline={false}
              rows={1}
              onKeyPress={handleKeyPress}
            />

            <Button
              disabled={message === ""}
              type="submit" // 메시지 전송
              className="send-button"
            >
              전송
            </Button>
          </form>
        </div>
  )
}

export default InputField