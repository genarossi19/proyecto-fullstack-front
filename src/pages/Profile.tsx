import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { User, Edit, Mail, Calendar, ArrowLeft, LogOut } from "lucide-react";

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleEditProfile = () => {
    navigate("/profile/edit");
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
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

  const initials = `${user.name.charAt(0)}${user.lastname.charAt(
    0
  )}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Botón Atrás */}
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        {/* Card Principal */}
        <Card className="card-shadow border-0">
          {/* Header con Avatar */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-8 flex flex-col items-center">
            <div className="w-24 h-24 bg-green-200 rounded-full flex items-center justify-center mb-4 shadow-md">
              <span className="text-4xl font-bold text-green-700">
                {initials}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.name} {user.lastname}
            </h1>
            <p className="text-gray-600 mt-1">{user.email}</p>
          </div>

          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Información del Usuario */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  Información Personal
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Nombre
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                      {user.name}
                    </div>
                  </div>

                  {/* Apellido */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Apellido
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                      {user.lastname}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Correo Electrónico
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium break-all">
                    {user.email}
                  </div>
                </div>

                {/* Fecha de Creación */}
                {user.createdAt && (
                  <div className="mt-6">
                    <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Miembro desde
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                      {new Date(user.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Separador */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Acciones
                </h2>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    onClick={handleEditProfile}
                    className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Editar Perfil
                  </Button>

                  <Button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="flex-1 h-11 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg border border-red-200 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4 mr-2 text-red-600 group-hover:text-red-900" />
                    {isLoading ? "Cerrando sesión..." : "Cerrar Sesión"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card de Información */}
        <Card className="card-shadow border-0 mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Información</h3>
            <p className="text-sm text-gray-600">
              Esta es tu información de perfil en EPYGEA. Para cambiar tu
              nombre, apellido o contraseña, haz clic en el botón "Editar
              Perfil".
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
