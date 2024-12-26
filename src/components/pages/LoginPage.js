import React, { useState } from "react";
import socket from "../../server";
import { useNavigate } from "react-router-dom";

function LoginPage({ onCustomerLogin }) {
  const [customerTel, setCustomerTel] = useState(""); // 고객 연락처 입력값
  const [branchCode, setBranchCode] = useState(""); // 지점 코드 입력값
  const [isBranchLogin, setIsBranchLogin] = useState(false); // 로그인 모드 상태
  const navigate = useNavigate();

  const handleCustomerLogin = () => {
    if (!customerTel) return alert("고객 연락처를 입력하세요");

    console.log("Logging in with customerTel:", customerTel); // 디버깅용

    socket.emit("customerLogin", customerTel, (response) => {
      if (response.ok) {
        onCustomerLogin(response.customer); // 유저 데이터를 저장
        navigate("/chat", {state: {user: response.customer}}); // 로그인 후 채팅 페이지로 이동
      } else {
        alert(`로그인 실패: ${response.message}`);
      }
    });
  };

  const handleBranchLogin = () => {
    if (!branchCode) return alert("지점 코드를 입력하세요");

    console.log("Logging in with branchCode:", branchCode); // 디버깅용

    socket.emit("branchLogin", (response) => {
      if (response.ok) {
        localStorage.setItem("branchCode", branchCode); // 지점 코드 로컬 스토리지 저장
        alert("지점 로그인 성공");
        navigate("/branch"); // 로그인 후 채팅 페이지로 이동
      } else {
        alert(`지점 로그인 실패: ${response.error}`);
      }
    });
  };

  return (
    <div>
      <h2>{isBranchLogin ? "지점 로그인" : "고객 로그인"}</h2>
      {!isBranchLogin ? (
        <div>
          <input
            type="text"
            placeholder="고객 연락처 입력"
            value={customerTel}
            onChange={(e) => setCustomerTel(e.target.value)}
          />
          <button onClick={handleCustomerLogin}>로그인</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="지점 코드 입력"
            value={branchCode}
            onChange={(e) => setBranchCode(e.target.value)}
          />
          <button onClick={handleBranchLogin}>로그인</button>
        </div>
      )}
      <button onClick={() => setIsBranchLogin(!isBranchLogin)}>
        {isBranchLogin ? "고객 로그인으로 전환" : "지점 로그인으로 전환"}
      </button>
    </div>
  );
}

export default LoginPage;
