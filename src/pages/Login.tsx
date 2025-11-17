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

interface LoginProps {
  onLogin?: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) newErrors.email = "Ingrese su correo electrónico.";
    else if (!emailRegex.test(trimmedEmail))
      newErrors.email = "El correo no tiene un formato válido.";

    if (!trimmedPassword) newErrors.password = "Ingrese su contraseña.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setIsLoading(true);

    try {
      await login(email, password);
      onLogin?.();
      navigate("/");
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message ||
          "Credenciales incorrectas. Intente nuevamente."
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
          <p className="text-gray-600 mt-1">Sistema de Gestión Agropecuaria</p>
        </div>

        <Card className="card-shadow border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center font-semibold text-gray-900">
              Iniciar Sesión
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1">
                <Label className="text-gray-700 font-medium">
                  Correo Electrónico
                </Label>
                <Input
                  type="email"
                  placeholder="admin@epygea.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label className="text-slate-700 font-medium">Contraseña</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
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
                {isLoading ? "Verificando..." : "Ingresar al Sistema"}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
              ¿No tenés una cuenta?{" "}
              <Link
                to="/signup"
                className="text-green-700 font-semibold hover:underline"
              >
                Registrarse
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
