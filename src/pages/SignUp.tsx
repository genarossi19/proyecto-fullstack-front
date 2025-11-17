"use client";

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
import { AlertCircle, Wheat } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { AxiosError } from "axios";

export default function SignUp() {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    const trimmedLastname = lastname.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName) newErrors.name = "El nombre es obligatorio.";

    if (!trimmedLastname) newErrors.lastname = "El apellido es obligatorio.";

    if (!trimmedEmail) newErrors.email = "El correo es obligatorio.";
    else if (!emailRegex.test(trimmedEmail))
      newErrors.email = "El correo no tiene un formato válido.";

    if (!trimmedPassword) newErrors.password = "La contraseña es obligatoria.";
    else if (trimmedPassword.length < 6)
      newErrors.password = "La contraseña debe tener mínimo 6 caracteres.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setIsLoading(true);

    try {
      await signup(name, lastname, email, password);
      navigate("/");
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message ||
          "Error en el registro. Intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-slate-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-9 h-9 bg-green-gradient rounded-lg shadow-sm">
            <Wheat className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
            EPYGEA
          </h1>
          <p className="text-gray-600 mt-1">Crear una nueva cuenta</p>
        </div>

        <Card className="card-shadow border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center font-semibold text-gray-900">
              Registrarse
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Nombre */}
              <div className="space-y-1">
                <Label className="text-gray-700 font-medium">Nombre</Label>
                <Input
                  placeholder="Juan"
                  className="h-11"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Apellido */}
              <div className="space-y-1">
                <Label className="text-gray-700 font-medium">Apellido</Label>
                <Input
                  placeholder="Pérez"
                  className="h-11"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
                {errors.lastname && (
                  <p className="text-sm text-red-600">{errors.lastname}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label className="text-gray-700 font-medium">
                  Correo Electrónico
                </Label>
                <Input
                  type="email"
                  placeholder="usuario@correo.com"
                  className="h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label className="text-gray-700 font-medium">Contraseña</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Error general */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Registrando..." : "Crear Cuenta"}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
              ¿Ya tenés cuenta?{" "}
              <Link
                to="/login"
                className="text-green-700 font-semibold hover:underline"
              >
                Iniciar Sesión
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
