import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import { ReservationState } from "../types/Reservation";
import { getUserIdFromToken } from "../utils/auth";

export const useConsultings = () => {
    const userId = getUserIdFromToken();
    const [hasUpComingReservation, setHasUpComingReservation] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const updateCompletedReservations = async (completedReservations: ReservationState[]) => {
        if (completedReservations.length === 0) return;

        try {
            await Promise.all(
                completedReservations.map((reservation) =>
                    apiRequest(`/api/consulting/${reservation.id}/complete`, { method: "PATCH" })
                )
            );
        } catch (error) {
            console.error("예약 상태 업데이트 실패: ", error);
        }
    }

    useEffect(() => {
        if (!userId) return;

        const fetchReservations = async () => {
            try {
                const reservations = await apiRequest(`/api/consulting/user/${userId}`);
                const now = new Date();

                // 예약 목록 필터링해 업데이트할 예약 찾기
                const completedReservations = reservations.filter((reservation: ReservationState) => {
                    const reservationTime = new Date(reservation.time);
                    return reservationTime < now && reservation.status == "SCHEDULED";
                })

                await updateCompletedReservations(completedReservations);

                // 임박한 예약이 있는지 확인
                const hasUpComing = reservations.some((reservation: ReservationState) => {
                    const reservationTime = new Date(reservation.time);
                    const diffHours = (reservationTime.getTime() - now.getTime()) / (1000 * 60 * 60);
                    return diffHours > 0 && diffHours <= 24;
                });

                setHasUpComingReservation(hasUpComing);

                // 툴팁을 3초 동안 표시
                if (hasUpComing) {
                    setShowTooltip(true);
                    setTimeout(() => setShowTooltip(false), 3000);
                }
            } catch (error) {
                console.error('예약 정보를 불러오는 데 실패했습니다.', error);
            }
        };
        fetchReservations();
    }, [userId]);

    return { hasUpComingReservation, showTooltip };
}