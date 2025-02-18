export async function apiRequest(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}), // ✅ Authorization 헤더 추가
  };

  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  if (!response.ok) {
    console.error("API 요청 실패:", response.status);
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  return response.json();
}
