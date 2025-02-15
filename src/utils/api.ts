export const apiRequest = async (endpoint: string, options = {}) => {
    const accessToken = localStorage.getItem("accessToken");
  
    const headers = {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };
  
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
      ...options,
      headers,
    });
  
    if (response.status === 401) {
      console.warn("토큰 만료: 자동 로그아웃 실행");
      localStorage.removeItem("accessToken");
      window.dispatchEvent(new Event("storage"));
      window.location.href = "/";
    }
  
    return response.json();
  };
  