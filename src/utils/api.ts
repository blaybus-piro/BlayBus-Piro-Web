export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    // 토큰이 없을 경우 로그인 페이지로 리다이렉트하거나 에러를 throw
    throw new Error("Authentication required");
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
    ...(options.headers || {})
  };

  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // 에러 응답의 body도 확인할 수 있도록 수정
      const errorBody = await response.text();
      console.error(`API Error: ${response.status}`, errorBody);
      throw new Error(`Request failed with status ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    
    return response;

  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
};