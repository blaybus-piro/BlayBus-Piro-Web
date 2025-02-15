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
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }
  
    return response.json();
  };
  