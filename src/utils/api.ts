export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const accessToken = localStorage.getItem("accessToken");
  
  if (!accessToken) {
    console.error('No token found in localStorage');
    // window.location.href = '/'; // 로그인 페이지로 리다이렉트
    throw new Error('Authentication required');
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
    
    if (!response.ok) {
      if (response.status === 401) {
        // 토큰이 만료되었거나 유효하지 않은 경우
        localStorage.removeItem('accessToken');
        // window.location.href = '/'; // 로그인 페이지로 리다이렉트
        throw new Error('Authentication failed');
      }
      throw new Error(`Request failed with status ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    
    return response;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};