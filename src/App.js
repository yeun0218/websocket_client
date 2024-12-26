import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage.js";
import ChatPage from "./components/pages/Chatpage/ChatPage.jsx";
import BranchPage from "./components/pages/BranchPage.jsx";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // useNavigate를 사용하여 라우팅 처리
  const [customers, setCustomers] = useState([]);


  const handleCustomerLogin = (customerData) => {
    if (!customerData.customer_tel) {
      console.error("CustomerTel is missing in login data");
      return;
    }

    setUser({
      ...customerData,
      type: "customer",
    });
  };

  const handleBranchLogin = (customerList) => {
    setCustomers(customerList);
  };

  return (
    <Routes>
      <Route path="/" element={<LoginPage onCustomerLogin={handleCustomerLogin} />} />
      <Route path="/branch" element={<BranchPage customers={customers} />} />
      <Route path="/chat" element={<ChatPage user={user} />} />
    </Routes>
  );
}

export default App;
