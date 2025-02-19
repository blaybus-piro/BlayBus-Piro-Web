import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import '../styles/Payment.styles.css';
import { createConsulting } from '../api/consulting';

type PaymentMethod = 'account' | 'kakao' | null;
type TransferMethod = 'app' | 'direct' | null;
type BankOption = 'toss' | 'kakaopay' | 'won' | 'kb' | null;

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [transferMethod, setTransferMethod] = useState<TransferMethod>(null);
  const [selectedBank, setSelectedBank] = useState<BankOption>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDate, selectedTime, consultMethod } = location.state || {};
  const amount = consultMethod === 'offline' ? 40000 : 20000;
  const [isReservationInfoOpen, setIsReservationInfoOpen] = useState(false);
  const [isAppTransferVisible, setIsAppTransferVisible] = useState(false);

  

  const toggleReservationInfo = () => {
    setIsReservationInfoOpen((prev) => !prev);
  };

  const isDockerEnv = window.location.hostname === "backend";
  const BACKEND_URL = isDockerEnv
      ? "http://backend:8080"
      : import.meta.env.VITE_BACKEND_URL || "https://blarybus-haertz.netlify.app";

  // const handlePayment = async () => {
  //   if (!paymentMethod) return;
  
  //   const reservationInfo = JSON.parse(localStorage.getItem("reservationInfo") || "{}");
  //   const { startTime, designerId } = reservationInfo;
  
  //   try {
  //     let response;
  //     if (paymentMethod === 'kakao') {
  //       response = await fetch(`${BACKEND_URL}/api/pay/ready`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ amount }),
  //       });
  
  //       if (!response.ok) {
  //         throw new Error(`결제 요청 실패: ${response.status}`);
  //       }
  
  //       const data = await response.json();
  //       localStorage.setItem("kakao_tid", data.tid);  // 결제 고유 ID 저장
  //       window.location.href = window.innerWidth > 768 ? data.next_redirect_pc_url : data.next_redirect_mobile_url;
  //       return; // 결제 리디렉트 후에는 함수 종료
  //     }
  //   } catch (error) {
  //     console.error('결제 요청 중 오류:', error);
  //     alert(`결제 처리 중 오류가 발생했습니다: ${(error as Error).message}`);
  //   }
  // };
  
  // 결제 승인 API를 통해 결제 확인 후 예약 생성
  const confirmPaymentAndReserve = useCallback(async (pg_token: string) => {
    const tid = localStorage.getItem("kakao_tid");
    if (!tid) {
      alert("결제 정보가 없습니다.");
      return;
    }
  
    try {
      const response = await fetch(`${BACKEND_URL}/api/pay/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tid, pg_token, amount }),
      });
  
      if (!response.ok) {
        throw new Error(`결제 승인 실패: ${response.status}`);
      }
  
      const paymentData = await response.json();
      if (!paymentData.approved) {
        throw new Error("결제가 승인되지 않았습니다.");
      }
  
      // 결제 성공 시 예약 생성
      const reservationInfo = JSON.parse(localStorage.getItem("reservationInfo") || "{}");
      const { startTime, designerId } = reservationInfo;
  
      const reservationResponse = await createConsulting({
        startTime,
        designer_id: designerId,
        meet: consultMethod,
        pay: 'KAKAO'
      });
  
      if (!reservationResponse.ok) {
        throw new Error(`예약 요청 실패: ${reservationResponse.status}`);
      }
  
      const reservationData = await reservationResponse.json();
      navigate('/reservationcomplete', {
        state: {
          selectedDate,
          selectedTime,
          consultMethod,
          paymentMethod: 'kakao',
          consultingId: reservationData.consultingId,
          status: reservationData.status
        },
      });
  
    } catch (error) {
      console.error("결제 승인 또는 예약 생성 실패:", error);
      alert(`결제 승인 처리 중 오류가 발생했습니다: ${(error as Error).message}`);
    }
  }, [navigate, amount, selectedDate, selectedTime, consultMethod, BACKEND_URL]);
  
  // ✅ useEffect에서 pg_token 감지하여 실행
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pgToken = queryParams.get("pg_token");

    if (pgToken) {
      confirmPaymentAndReserve(pgToken);
    }
  }, [location.search, confirmPaymentAndReserve]);

  // ✅ 결제 요청 함수
  const handlePayment = async () => {
    if (!paymentMethod) return;

    try {
      if (paymentMethod === 'kakao') {
        const response = await fetch(`${BACKEND_URL}/api/pay/ready`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount }),
        });

        if (!response.ok) {
          throw new Error(`결제 요청 실패: ${response.status}`);
        }

        const data = await response.json();
        localStorage.setItem("kakao_tid", data.tid);  // 결제 고유 ID 저장
        window.location.href = window.innerWidth > 768 ? data.next_redirect_pc_url : data.next_redirect_mobile_url;
      }
    } catch (error) {
      console.error('결제 요청 중 오류:', error);
      alert(`결제 처리 중 오류가 발생했습니다: ${(error as Error).message}`);
    }
  };
      

  const handleAccountTransfer = () => {
    setPaymentMethod('account');
    setIsAppTransferVisible(true);
    setTransferMethod(null);
    setSelectedBank(null);
  };

  const handleKakaoPay = () => {
    setPaymentMethod('kakao');
    setIsAppTransferVisible(false);
    setTransferMethod(null);
    setSelectedBank(null);
  };

  const handleTransferMethodChange = (method: TransferMethod) => {
    setTransferMethod(method);
    if (method === 'direct') {
      setSelectedBank(null);
    }
  };

  const handleBankSelection = (bank: BankOption) => {
    setSelectedBank(bank);
  };

  const handleBankPayment = () => {
    let deeplink = "";
    const clipboardText = "138910305992207";
  
    switch (selectedBank) {
      case "toss":
        deeplink = "supertoss://send?account=508116542988&amount=190000";
        break;
      case "kakaopay":
        deeplink = "kakaopay://";
        break;
      case "won":
        deeplink = "SFG-SHB-sbank://?";
        break;
      case "kb":
        deeplink = "kBbank://?";
        break;
      default:
        alert("은행을 선택해 주세요.");
        return;
    }

    navigator.clipboard.writeText(clipboardText).then(() => {
      alert("계좌번호가 복사되었습니다.");
    });
  
    window.location.href = deeplink;
  };
  
  
  return (
    <div className="payment-container">
    {/* 고정된 헤더 */}
    <div className="payment-header">
      <Header title="결제하기" />
    </div>
      
    <div className="payment-wrapper" style={{ overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
      <div className="payment-content">
        <div className="info-section">
          <div className={`toggle-container ${isReservationInfoOpen ? 'open' : ''}`}>
            <div className="toggle-info" onClick={toggleReservationInfo}>
              <span className="toggle-title">예약자 정보</span>
              <span className={`arrow ${isReservationInfoOpen ? 'open' : ''}`}>
                <img src="/icons/toggle-before.svg" alt="toggle" />
              </span>
            </div>
            {isReservationInfoOpen && (
              <div className="toggle-details">
                <div className="info-row">
                  <span className="info-label">성함</span>
                  <span className="info-value">송연우</span>
                </div>
                <div className="info-row">
                  <span className="info-label">이메일</span>
                  <span className="info-value">supreme1mode@gmail.com</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="payment-method-section">
          <h2 className="section-title">결제 방식을 선택해 주세요</h2>
          <div className="payment-buttons">
            <button 
              className={`payment-method-button ${paymentMethod === 'account' ? 'selected' : ''}`}
              onClick={handleAccountTransfer}
            >
              계좌이체
            </button>
            <button 
              className={`payment-method-button ${paymentMethod === 'kakao' ? 'selected' : ''}`}
              onClick={handleKakaoPay}
            >
              <img src="/icons/kakaopay.svg" alt="kakaopay" className="kakao-icon" />
              카카오페이
            </button>
          </div>

          {isAppTransferVisible && (
            <div className="app-transfer-options">
              <label className="radio-option">
                <input 
                  type="radio" 
                  name="transferMethod" 
                  value="app" 
                  checked={transferMethod === "app"}
                  onChange={() => handleTransferMethodChange("app")}
                />
                <span className="send-money-text">앱으로 이체하기</span>
              </label>
              {transferMethod === 'app' && (
                <div className="app-buttons">
                  <button 
                    className={`app-button ${selectedBank === 'toss' ? 'selected' : ''}`}
                    onClick={() => handleBankSelection('toss')}
                  >
                    <img src="/icons/toss.svg" alt="Toss" />
                    토스 송금하기
                  </button>
                  <button 
                    className={`app-button ${selectedBank === 'kakaopay' ? 'selected' : ''}`}
                    onClick={() => handleBankSelection('kakaopay')}
                  >
                    <img src="/icons/kakaopay.svg" alt="KakaoPay" />
                    카카오페이 송금하기
                  </button>
                  <button 
                    className={`app-button ${selectedBank === 'won' ? 'selected' : ''}`}
                    onClick={() => handleBankSelection('won')}
                  >
                    <img src="/icons/won.svg" alt="WON" />
                    우리WON뱅킹 송금하기
                  </button>
                  <button 
                    className={`app-button ${selectedBank === 'kb' ? 'selected' : ''}`}
                    onClick={() => handleBankSelection('kb')}
                  >
                    <img src="/icons/kb.svg" alt="KB" />
                    KB스타뱅킹 송금하기
                  </button>
                </div>
              )}

              <label className="radio-option">
                <input 
                  type="radio" 
                  name="transferMethod" 
                  value="direct" 
                  checked={transferMethod === "direct"}
                  onChange={() => handleTransferMethodChange("direct")}
                />
                <span className="send-money-text">직접 이체하기</span>
              </label>

              {transferMethod === 'direct' && (
                <div className="deposit-info">
                  <h3 className="deposit-title">입금 정보</h3>
                  <div className="deposit-grid">
                    <div className="deposit-item">
                      <span className="deposit-label">예금주 명</span>
                      <span className="deposit-value">송연우</span>
                    </div>
                    <div className="deposit-item">
                      <span className="deposit-label">은행명</span>
                      <span className="deposit-value">하나은행</span>
                    </div>
                    <div className="deposit-item">
                      <span className="deposit-label">계좌번호</span>
                      <div className="account-number">
                        <span className="deposit-value">138910305992207</span>
                      </div>
                    </div>
                    <div className="deposit-item">
                      <span className="deposit-label">금액</span>
                      <span className="deposit-value">{amount.toLocaleString()}원 ({amount === 40000 ? '4만원' : '2만원'})</span>
                    </div>
                    <button onClick={() => {
                      navigator.clipboard.writeText('138910305992207');
                      alert('계좌번호가 복사되었습니다.');
                    }} className="deposit-copy-button">
                      클립보드 복사하기
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <footer className="payment-footer">
      <button 
        className={`payment-button ${!paymentMethod ? 'disabled' : ''}`}
        disabled={!paymentMethod}
        onClick={() => {
          if (paymentMethod === "account" && transferMethod === "app") {
            handleBankPayment();
          } else {
            handlePayment();
          }
        }}
      >
        {amount.toLocaleString()}원 결제하기
      </button>
      </footer>
    </div>
    </div>
  );
}