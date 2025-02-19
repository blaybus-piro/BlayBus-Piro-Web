// 예약을 필터링하고 정렬
import { useState, useEffect } from "react";
import { ReservationState } from "../types/Reservation";

export const useFilteredReservations = (reservations: ReservationState[]) => {
    const [filteredReservations, setFilteredReservations] = useState<ReservationState[]>([]);
    const [scheduledTab, setScheduledTab] = useState<"scheduled" | "completed">("scheduled");

    useEffect(() => {
        if (!reservations.length) return;

        const filtered = reservations.filter((res) => {
            if (scheduledTab === "scheduled") return res.status === "FREE" || res.status === "SCHEDULED";
            return res.status === "CANCELED" || res.status === "COMPLETE";
        });

        const sortedReservations = [...filtered].sort((a, b) => {
            return new Date(b.time).getTime() - new Date(a.time).getTime();
        });

        setFilteredReservations(sortedReservations);
    }, [reservations, scheduledTab]);

    return { filteredReservations, scheduledTab, setScheduledTab };
};