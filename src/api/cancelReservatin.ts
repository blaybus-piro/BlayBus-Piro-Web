import { apiRequest } from "../utils/api";

export const cancelReservation = async (reservationId: string) => {
    try {
        const response = await apiRequest(`/api/consulting/${reservationId}/canceled`, {
            method: "PATCH",
        });

        if (!response.ok) {
            throw new Error(`서버 오류: ${response.status}`);
        }

        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        console.log("예약 취소 성공: ", data);
        return data;
    } catch (error) {
        console.error("예약 취소 실패: error");
    }
};