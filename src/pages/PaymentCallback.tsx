import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PaymentCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const paymentId = urlParams.get("payment_id");

    if (!paymentId) {
      console.error("결제 ID 없음");
      navigate("/");
      return;
    }

    fetch(`/api/pay/status?payment_id=${paymentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "SUCCESS") {
          navigate("/reservationcomplete");
        } else {
          console.error("결제 실패:", data);
          alert("결제가 실패하였습니다.");
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("결제 확인 오류:", err);
        navigate("/");
      });
  }, [location, navigate]);

  return <div>결제 확인 중...</div>;
}
