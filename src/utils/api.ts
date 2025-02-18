export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.warn("No access token found");
    // 토큰이 없을 때의 처리를 추가할 수 있습니다
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`, // 항상 Authorization 헤더 포함
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