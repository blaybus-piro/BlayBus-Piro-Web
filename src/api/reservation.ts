import axios from "axios";

const isDockerEnv = window.location.hostname === "backend"; // Docker 내부인지 확인
const BACKEND_URL = isDockerEnv
    ? "http://backend:8080"  // Docker 컨테이너 내부에서 실행할 때
    : import.meta.env.VITE_BACKEND_URL || "https://blarybus-haertz.netlify.app"; // 로컬 환경

export const fetchReservations = async (userId: string) => {
    try {
        const token = localStorage.getItem("accessToken");
        console.log(localStorage.getItem("accessToken"));

        if (!token) throw new Error("로그인이 필요합니다.");

        console.log("Stored AccessToken: ", token);

        const response = await axios.get(`${BACKEND_URL}/api/consulting/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error("예약 정보를 불러오는데 실패했습니다.", error);
        throw error;
    }
}