import React, { useState } from "react";
import socket from "../../server";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/base";

function LoginPage({ onCustomerLogin, onBranchLogin }) {
  const [customerTel, setCustomerTel] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const navigate = useNavigate();

  const handleCustomerLogin = () => {
    const customerTel = prompt("고객 연락처를 입력하세요");
    if (!customerTel) return alert("고객 연락처가 필요합니다");
    socket.emit("customerLogin", customerTel, (response) => {
      if (response.ok) {
        onCustomerLogin(response.data);
        navigate("/rooms"); // 로그인 성공 시 방 목록 페이지로 이동
      } else {
        alert(`로그인 실패: ${response.message}`);
      }
    });
  };

  const handleBranchLogin = () => {
    const branchCode = prompt("브랜치 코드를 입력하세요");
    if (!branchCode) return alert("브랜치 코드가 필요합니다");
    socket.emit("branchLogin", branchCode, (response) => {
      if (response.ok) {
        onBranchLogin(response.data);
        navigate("/rooms"); // 로그인 성공 시 방 목록 페이지로 이동
      } else {
        alert(`로그인 실패: ${response.message}`);
      }
    });
  };

  return (
    <div>
      <Button onClick={handleCustomerLogin}>고객 로그인</Button>
      <Button onClick={handleBranchLogin}>브랜치 로그인</Button>
    </div>
  );
}

export default LoginPage;
