export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const accessToken = localStorage.getItem("accessToken");
  
  // 토큰 상태 확인
  if (!accessToken) {
    console.error('No token found in localStorage');
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
    ...(options.headers || {})
  };

  console.log('Request URL:', `${import.meta.env.VITE_BACKEND_URL}${endpoint}`);
  console.log('Request headers:', headers);

  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // 응답 상세 로깅
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));

    if (!response.ok) {
      if (response.status === 401) {
        // 토큰이 만료되었거나 유효하지 않은 경우
        localStorage.removeItem('accessToken');
        return;
      }
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};