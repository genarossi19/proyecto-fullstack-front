import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 20000,
  withCredentials: true, // Habilita el envío de cookies
});

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si recibimos un 401 y no hemos intentado refresh aún
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar refrescar el token
        await api.post("/auth/refresh");
        // Reintentar la solicitud original
        return api(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, redirigir a login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
