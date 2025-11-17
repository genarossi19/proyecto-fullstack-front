import type React from "react";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { createClient } from "../api/services/ClientService";
import { toast } from "sonner";

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated?: () => void;
}

interface FormData {
  name: string;
  cuit: string;
  phone: string;
  email: string;
  address: string;
  active: boolean;
}

interface FormErrors {
  name?: string;
  cuit?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export function CreateClientModal({
  isOpen,
  onClose,
  onClientCreated,
}: CreateClientModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    cuit: "",
    phone: "",
    email: "",
    address: "",
    active: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    }

    // Validar CUIT
    if (!formData.cuit.trim()) {
      newErrors.cuit = "El CUIT es requerido";
    } else if (!/^\d{11}$/.test(formData.cuit.replace(/\D/g, ""))) {
      newErrors.cuit = "El CUIT debe tener 11 dígitos";
    }

    // Validar teléfono
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    } else if (formData.phone.replace(/\D/g, "").length < 7) {
      newErrors.phone = "El teléfono debe tener al menos 7 dígitos";
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    // Validar dirección
    if (!formData.address.trim()) {
      newErrors.address = "La dirección es requerida";
    } else if (formData.address.trim().length < 5) {
      newErrors.address = "La dirección debe tener al menos 5 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor completa todos los campos correctamente");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convertir CUIT a número
      const cuitNumber = parseInt(formData.cuit.replace(/\D/g, ""), 10);

      const clientData = {
        name: formData.name.trim(),
        cuit: cuitNumber,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        active: formData.active,
      };

      await createClient(clientData);

      toast.success("Cliente creado exitosamente");

      // Limpiar formulario
      setFormData({
        name: "",
        cuit: "",
        phone: "",
        email: "",
        address: "",
        active: true,
      });
      setErrors({});

      // Llamar callback si existe
      onClientCreated?.();

      onClose();
    } catch (error) {
      console.error("Error creating client:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error("Error al crear el cliente", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-60 p-4 backdrop-blur-sm bg-black/50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">Nuevo Cliente</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="md:col-span-2">
                <Label
                  htmlFor="name"
                  className={errors.name ? "text-red-600" : ""}
                >
                  Nombre del Cliente *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ej: Finca San José S.A."
                  className={`${
                    errors.name ? "border-red-500" : ""
                  } placeholder:text-gray-400`}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              {/* CUIT */}
              <div>
                <Label
                  htmlFor="cuit"
                  className={errors.cuit ? "text-red-600" : ""}
                >
                  CUIT *
                </Label>
                <Input
                  id="cuit"
                  type="text"
                  value={formData.cuit}
                  onChange={(e) => handleInputChange("cuit", e.target.value)}
                  placeholder="20123456789"
                  className={`${
                    errors.cuit ? "border-red-500" : ""
                  } placeholder:text-gray-400`}
                  disabled={isSubmitting}
                  maxLength={13}
                />
                {errors.cuit && (
                  <p className="text-sm text-red-600 mt-1">{errors.cuit}</p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <Label
                  htmlFor="phone"
                  className={errors.phone ? "text-red-600" : ""}
                >
                  Teléfono *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+54 11 1234-5678"
                  className={`${
                    errors.phone ? "border-red-500" : ""
                  } placeholder:text-gray-400`}
                  disabled={isSubmitting}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label
                  htmlFor="email"
                  className={errors.email ? "text-red-600" : ""}
                >
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="contacto@empresa.com"
                  className={`${
                    errors.email ? "border-red-500" : ""
                  } placeholder:text-gray-400`}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Dirección */}
              <div className="md:col-span-2">
                <Label
                  htmlFor="address"
                  className={errors.address ? "text-red-600" : ""}
                >
                  Dirección *
                </Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Ej: Av. San Martín 1250, Buenos Aires"
                  className={`${
                    errors.address ? "border-red-500" : ""
                  } placeholder:text-gray-400`}
                  disabled={isSubmitting}
                />
                {errors.address && (
                  <p className="text-sm text-red-600 mt-1">{errors.address}</p>
                )}
              </div>

              {/* Cliente Activo */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) =>
                      handleInputChange("active", checked as boolean)
                    }
                    disabled={isSubmitting}
                  />
                  <Label
                    htmlFor="active"
                    className="text-sm font-medium text-gray-700"
                  >
                    Cliente Activo
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                {isSubmitting ? "Creando..." : "Crear Cliente"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
