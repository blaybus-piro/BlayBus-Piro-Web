import { apiRequest } from "../utils/api";

export const cancelReservation = async (reservationId: string) => {
    try {
        const response = await apiRequest(`/api/consulting/${reservationId}/cancel`, {
            method: "PATCH",
        });
        return response;
    } catch (error) {
        console.error("예약 취소 실패: ", error);
        throw error;
    }
}