import { useEffect, useRef } from "react";
import "./MessageContainer.css";
import { Container } from "@mui/system";

const MessageContainer = ({ messageList, user}) => {
 //console.log("msgContainer", messageList );
  
  const messageEndRef = useRef(null); // 마지막 메시지 참조
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({behavior : "smooth"}); // 스크롤 이동
  }, [messageList]); 
  
  if (!Array.isArray(messageList) || messageList.length === 0) {
    return <div className="no-messages">No messages available</div>; // messageList가 배열이 아닐 경우 메시지 출력
  }
  
  
  return (
    <div className="messages-wrapper">
      {messageList.map((message, index) => {
        // const isCustomerMessage = message.sender_type === "customer";
        // const isBranchMessage = message.sender_type === "branch";
        // const isSystemMessage = message.sender_type === "system";

        const isMyMessage =
          (user.customerTel && message.sender_tel === user.customerTel) ||
          (user.branchCode && message.sender_id === user.branchCode); // 내 메시지 여부
        const isOtherMessage = !isMyMessage; // 상대방 메시지 여부
        const isSystemMessage = message.sender_type === "system"; // 시스템 메시지 여부

        // 메시지 유형 디버깅
        //console.log(`Rendering message at index ${index}:`, message);

        // 메시지에 프로필 이미지 표시 여부를 위한 로직
        const shouldShowProfileImage =
          index === 0 ||
          messageList[index - 1]?.sender_tel !== message.sender_tel || // 이전 메시지와 보낸 사람 다르면 이미지 표시
          messageList[index - 1]?.sender_type === message.sender_type;  // 이전 메시지가 시스템 메시지면 이미지 표시

          const formatTime = (timeString) => {
            const date = new Date(timeString);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? "오후" : "오전";
            const formattedHours = hours % 12 || 12; // 12시간제로 변환
            return `${ampm} ${formattedHours}:${minutes < 10 ? `0${minutes}` : minutes}`;
          };

        return (
          <Container key={index} 
          className={`message-container ${
            isMyMessage
              ? "my-message-container"
              : isOtherMessage
              ? "other-message-container"
              : isSystemMessage
              ? "system-message-container"
              : ""
            }`}
          >
             {isSystemMessage ? (
              <div className="system-message">{message.message}</div>
            ) :  (
              <>
               {shouldShowProfileImage && !isMyMessage && (
                  <img
                    src="/profile.jpeg"
                    className="profile-image"
                    alt="Sender"
                  />
                )}
                {!shouldShowProfileImage && !isMyMessage && (
                  <div className="profile-placeholder"></div>
                )}
                <div
                  className={`message ${
                    isMyMessage ? "my-message" : "other-message"
                  }`}
                >
                  <p className="message-text">{message.message}</p>
                  <span className="message-time">
                  {formatTime(message.created_at)}
                  </span>
                </div>
              </>
            )}
          </Container>
        );
      })}
      <div ref={messageEndRef} /> {/**스크롤 기준점  */}
    </div>
    // <div>
    //   {messageList.map((message, index) => {
    //     const isMyMessage =
    //       (user.customerTel && message.sender_tel === user.customerTel) ||
    //       (user.branchCode && message.sender_id === user.branchCode); // 내 메시지 여부 확인
    //     const isOtherMessage = !isMyMessage; // 상대방 메시지 여부

    //     // 메시지 디버깅 로그
    //     console.log(`Rendering message at index ${index}:`, message);

    //     return (
    //       <Container key={index} className="message-container">
    //         {isMyMessage ? (
    //           <div className="my-message-container">
    //             <div className="my-message">{message.message}</div>
    //           </div>
    //         ) : isOtherMessage ? (
    //           <div className="other-message-container">
    //             <img
    //               src="/profile.jpeg"
    //               className="profile-image"
    //               alt="Sender"
    //             />
    //             <div className="other-message">{message.message}</div>
    //           </div>
    //         ) : (
    //           <div className="unknown-message">
    //             <p>Unknown message type: {message.sender_type}</p>
    //           </div>
    //         )}
    //       </Container>
    //     );
    //   })}
    // </div>
  );
};

export default MessageContainer;
