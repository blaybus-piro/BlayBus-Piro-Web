import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PaymentCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const orderId = urlParams.get("orderId");
    const pgToken = urlParams.get("pg_token");

    // 기존 예약 정보 가져오기
    const selectedDate = localStorage.getItem("selectedDate");
    const selectedTime = localStorage.getItem("selectedTime");
    const consultMethod = localStorage.getItem("consultMethod");

    if (!selectedDate || !selectedTime || !consultMethod) {
      console.error("❌ 예약 정보가 없습니다.");
      alert("예약 정보를 찾을 수 없습니다.");
      navigate("/");
      return;
    }

    console.log("✅ 결제 완료! 서버에서 approve 요청을 처리함.");
    
    fetch(`/api/pay/approve?orderId=${orderId}&pg_token=${pgToken}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ 결제 승인 응답:", data);

        if (data.status === "SUCCESS") {
          console.log("✅ 결제 성공! /reservationcomplete로 이동");

          // 결제 정보만 새로 저장
          localStorage.setItem("amount", data.amount.total.toString());
          localStorage.setItem("approved_at", data.approved_at);
          localStorage.setItem("item_name", data.item_name);

          navigate("/reservationcomplete");
        } else {
          console.error("❌ 결제 승인 실패:", data);
          alert("결제 승인이 실패하였습니다.");
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("❌ 결제 승인 요청 오류:", err);
        navigate("/");
      });
  }, [location, navigate]);

  return <div>결제 승인 중... 잠시만 기다려 주세요.</div>;
}