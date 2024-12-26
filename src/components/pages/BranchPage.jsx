import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../server.js";

function BranchPage() {
  const [customers, setCustomers] = useState([]); // 고객 리스트
  const navigate = useNavigate();

  useEffect(() => {
    const branchCode = localStorage.getItem("branchCode");
    if (!branchCode) {
      alert("지점 코드가 없습니다. 다시 로그인하세요.");
      navigate("/");
      return;
    }

    // 서버에서 고객 리스트를 받아옴
    socket.emit("branchLogin", (response) => {
      console.log("Branch login response:", response);
      if (response.ok) {
        setCustomers(response.customers);
        console.log("Customers fetched:", response.customers);
      } else {
        console.error("Failed to fetch customers:", response.error);
      }
    });
  }, [navigate]);

  const handleCustomerClick = (customer) => {
    navigate("/chat", { state: { user: customer } }); // 고객 정보를 채팅 페이지로 전달
  };

  return (
    <div>
      <h2>고객 리스트</h2>
      {customers.length > 0 ? (
        <ul>
          {customers.map((customer) => (
            <li key={customer.tel}>
              <button onClick={() => handleCustomerClick(customer)}>
                {customer.name} ({customer.tel})
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>현재 연결된 고객이 없습니다.</p>
      )}
    </div>
  );
}

export default BranchPage;
