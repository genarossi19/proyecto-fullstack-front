import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, ArrowLeft, Save, X } from "lucide-react";
import api from "../lib/axios";
import type { AxiosError } from "axios";
import type { UserType } from "../types/UserType";

export function EditProfile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const trimmedName = formData.name.trim();
    const trimmedLastname = formData.lastname.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName) newErrors.name = "El nombre es obligatorio.";
    if (!trimmedLastname) newErrors.lastname = "El apellido es obligatorio.";

    if (!trimmedEmail) newErrors.email = "El correo es obligatorio.";
    else if (!emailRegex.test(trimmedEmail))
      newErrors.email = "El correo no tiene un formato válido.";

    if (showPasswordForm) {
      if (!formData.currentPassword)
        newErrors.currentPassword =
          "Ingresa tu contraseña actual para cambiarla.";
      if (!formData.newPassword)
        newErrors.newPassword = "Ingresa la nueva contraseña.";
      else if (formData.newPassword.length < 6)
        newErrors.newPassword = "La contraseña debe tener mínimo 6 caracteres.";

      if (formData.newPassword !== formData.confirmPassword)
        newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const updateData: Record<string, string> = {
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
      };

      const passwordChanged = showPasswordForm && formData.newPassword;

      if (passwordChanged) {
        updateData.password = formData.newPassword;
      }

      await api.put(`/users/${user?.id}`, updateData);

      setSuccess(
        passwordChanged
          ? "Contraseña actualizada. Por favor, inicia sesión nuevamente."
          : "Perfil actualizado correctamente."
      );

      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);

      // Si cambió contraseña, cerrar sesión y redirigir a login
      if (passwordChanged) {
        setTimeout(async () => {
          await logout();
          navigate("/login");
        }, 1500);
      } else {
        // Si no cambió contraseña, actualizar contexto y redirigir a perfil
        updateUser({
          ...user,
          name: formData.name,
          lastname: formData.lastname,
          email: formData.email,
        } as UserType);

        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ error?: string }>;
      setError(
        axiosError.response?.data?.error ||
          "Error al actualizar perfil. Intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No hay información del usuario</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Botón Atrás */}
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Perfil
        </Button>

        {/* Card Editar Perfil */}
        <Card className="card-shadow border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
            <CardTitle className="text-2xl text-gray-900">
              Editar Perfil
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Actualiza tu información personal
            </p>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error General */}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              {/* Éxito */}
              {success && (
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-sm text-green-700">{success}</span>
                </div>
              )}

              {/* Información Personal */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Información Personal
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre */}
                  <div className="space-y-1">
                    <Label className="text-gray-700 font-medium">Nombre</Label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="h-11"
                      placeholder="Tu nombre"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Apellido */}
                  <div className="space-y-1">
                    <Label className="text-gray-700 font-medium">
                      Apellido
                    </Label>
                    <Input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      className="h-11"
                      placeholder="Tu apellido"
                    />
                    {errors.lastname && (
                      <p className="text-sm text-red-600">{errors.lastname}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1 mt-4">
                  <Label className="text-gray-700 font-medium">
                    Correo Electrónico
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-11"
                    placeholder="tu@correo.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Separador */}
              <div className="border-t border-gray-200 pt-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  {showPasswordForm
                    ? "Cancelar cambio de contraseña"
                    : "Cambiar Contraseña"}
                </button>
              </div>

              {/* Cambiar Contraseña */}
              {showPasswordForm && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    Cambiar Contraseña
                  </h3>

                  {/* Contraseña Actual */}
                  <div className="space-y-1">
                    <Label className="text-gray-700 font-medium">
                      Contraseña Actual
                    </Label>
                    <Input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="h-11"
                      placeholder="••••••••"
                    />
                    {errors.currentPassword && (
                      <p className="text-sm text-red-600">
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>

                  {/* Nueva Contraseña */}
                  <div className="space-y-1">
                    <Label className="text-gray-700 font-medium">
                      Nueva Contraseña
                    </Label>
                    <Input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="h-11"
                      placeholder="••••••••"
                    />
                    {errors.newPassword && (
                      <p className="text-sm text-red-600">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  {/* Confirmar Contraseña */}
                  <div className="space-y-1">
                    <Label className="text-gray-700 font-medium">
                      Confirmar Contraseña
                    </Label>
                    <Input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="h-11"
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Botones de Acción */}
              <div className="flex flex-col gap-3 sm:flex-row border-t border-gray-200 pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? "Guardando..." : "Guardar Cambios"}
                </Button>

                <Button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="flex-1 h-11 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Advertencia */}
        <Card className="card-shadow border-0 mt-6 border-l-4 border-l-yellow-400">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">
              <strong>Nota:</strong> Si cambias tu contraseña, deberás cerrar
              sesión automáticamente y volver a iniciar sesión con la nueva
              contraseña.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
