// import { apiRequest } from "../utils/api";

export const cancelReservation = async (reservationId: string) => {
    try {
        // apiRequest를 직접 사용하지 않고 fetch 호출
        const response = await fetch(`/api/consulting/${reservationId}/canceled`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('예약 취소 실패');
        }

        // 응답 본문 확인 - 빈 응답일 경우 null 반환
        const text = await response.text();
        return text && text.trim() ? JSON.parse(text) : null;
    } catch (error) {
        console.error('예약 취소 중 오류:', error);
        throw error;
    }
}