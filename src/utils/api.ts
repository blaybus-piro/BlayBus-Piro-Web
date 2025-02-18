export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const accessToken = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // 401 포함 모든 에러 상태에 대해 에러 throw
    if (!response.ok) {
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