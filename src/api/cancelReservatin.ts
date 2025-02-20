import { apiRequest } from "../utils/api";

export const cancelReservation = async (reservationId: string) => {
    const response = await apiRequest(`/api/consulting/${reservationId}/canceled`, {
        method: "PATCH",
    });

    if (!response.ok) {
        throw new Error('예약 취소 실패');
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}