import axios from "axios";

const isDockerEnv = window.location.hostname === "backend"; // Docker 내부인지 확인
const BACKEND_URL = isDockerEnv
    ? "http://backend:8080"  // Docker 컨테이너 내부에서 실행할 때
    : import.meta.env.VITE_BACKEND_URL || "https://blarybus-haertz.netlify.app"; // 로컬 환경

export const fetchDesigner = async (designerId: string) => {
    try {
        const token = localStorage.getItem("accessToken");

        if (!token) throw new Error("로그인이 필요합니다.");

        const response = await axios.get(`${BACKEND_URL}/api/designer/${designerId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        console.error("디자이너 정보를 불러오는데 실패했습니다.", error);
        throw error;
    }
}