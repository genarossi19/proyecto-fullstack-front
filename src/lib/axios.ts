import axios from "axios";

// Usa la variable de entorno VITE_API_URL en producción (Vite expone las que empiezan por VITE_)
const API_BASE =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:3000";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
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

      // No intentar refresh para las rutas de autenticación (login/signup/logout/refresh/me)
      const skipRefreshFor = [
        "/users/login",
        "/users/signup",
        "/users/logout",
        "/users/refresh",
        "/users/me",
      ];
      if (
        originalRequest.url &&
        skipRefreshFor.some((p) => originalRequest.url.includes(p))
      ) {
        // Si ya estamos en la página de login, no forzar redirección para evitar bucles
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        // Intentar refrescar el token usando la ruta correcta
        await api.post("/users/refresh");
        // Reintentar la solicitud original
        return api(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, redirigir a login (si no estamos ya allí)
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
