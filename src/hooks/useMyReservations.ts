import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import { getUserIdFromToken } from "../utils/auth";
import { ReservationState } from "../types/Reservation";

export const useMyReservations = () => {
    const userId = getUserIdFromToken();
    const [myReservations, setMyReservations] = useState<ReservationState[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchReservations = async () => {
            try {
                const response = await apiRequest(`/api/consulting/user/${userId}`);
                if (!response) return;

                const formattedReservations = response.map((reservation: any) => ({
                    id: reservation.consultingId,
                    designerId: reservation.designerId,
                    designerName: reservation.designerName,
                    profileImage: reservation.designerProfile,
                    time: reservation.startTime,
                    meetLink: reservation.meetLink || null,
                    type: reservation.type,
                    status: reservation.status,
                    paymentAmount: reservation.paymentAmount || 0,
                    paymentMethod: reservation.pay
                }));

                setMyReservations(formattedReservations);
            } catch (error) {
                console.error("내 예약 목록을 불러오는 데 실패했습니다: ", error);
                setError("예약 목록을 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [userId]);

    return { myReservations, loading, error };
}