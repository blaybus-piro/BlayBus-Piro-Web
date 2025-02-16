export interface ReservationState {
    id: string;
    designerId: string;
    designerName: string;
    profileImage: string;
    time: string;
    type: "ONLINE" | "OFFLINE";
    status: "FREE" | "SCHEDULED" | "CANCELED" | "COMPLETED";
    meetLink?: string;
    paymentAmount: number;
    paymentMethod: "ACCOUNTMENT" | "KAKAOPAY";
}