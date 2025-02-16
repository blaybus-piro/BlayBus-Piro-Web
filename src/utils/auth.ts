export const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.id || null;  // userId 가져오기
    } catch (error) {
        console.error("JWT 디코딩 실패");
        return null;
    }
};