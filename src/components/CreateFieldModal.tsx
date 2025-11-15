import type React from "react";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { X } from "lucide-react";

interface CreateFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: number;
  clientName: string;
}

export function CreateFieldModal({
  isOpen,
  onClose,
  clientId,
  clientName,
}: CreateFieldModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    superficie_ha: "",
    latitud: "",
    longitud: "",
    cultivo_actual: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const cultivosOptions = [
    { value: "soja", label: "Soja" },
    { value: "maiz", label: "Maíz" },
    { value: "trigo", label: "Trigo" },
    { value: "girasol", label: "Girasol" },
    { value: "sorgo", label: "Sorgo" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre del campo es requerido";
    }

    if (!formData.superficie_ha) {
      newErrors.superficie_ha = "La superficie es requerida";
    } else if (Number.parseFloat(formData.superficie_ha) <= 0) {
      newErrors.superficie_ha = "La superficie debe ser mayor a 0";
    }

    if (!formData.latitud) {
      newErrors.latitud = "La latitud es requerida";
    } else if (isNaN(Number.parseFloat(formData.latitud))) {
      newErrors.latitud = "La latitud debe ser un número válido";
    }

    if (!formData.longitud) {
      newErrors.longitud = "La longitud es requerida";
    } else if (isNaN(Number.parseFloat(formData.longitud))) {
      newErrors.longitud = "La longitud debe ser un número válido";
    }

    if (!formData.cultivo_actual) {
      newErrors.cultivo_actual = "El cultivo actual es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Here you would typically make an API call to create the field
    console.log("Creating field:", {
      ...formData,
      id_cliente: clientId,
      superficie_ha: Number.parseFloat(formData.superficie_ha),
      latitud: Number.parseFloat(formData.latitud),
      longitud: Number.parseFloat(formData.longitud),
    });

    // Reset form and close modal
    setFormData({
      nombre: "",
      superficie_ha: "",
      latitud: "",
      longitud: "",
      cultivo_actual: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-60 p-4 backdrop-blur-sm bg-black/50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            Crear Nuevo Campo
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Cliente:</strong> {clientName}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Campo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.nombre ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ej: Campo Norte"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Superficie (hectáreas) *
                </label>
                <input
                  type="number"
                  name="superficie_ha"
                  value={formData.superficie_ha}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.superficie_ha ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="150.5"
                />
                {errors.superficie_ha && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.superficie_ha}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitud *
                </label>
                <input
                  type="number"
                  name="latitud"
                  value={formData.latitud}
                  onChange={handleInputChange}
                  step="any"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.latitud ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="-34.6037"
                />
                {errors.latitud && (
                  <p className="text-red-500 text-xs mt-1">{errors.latitud}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitud *
                </label>
                <input
                  type="number"
                  name="longitud"
                  value={formData.longitud}
                  onChange={handleInputChange}
                  step="any"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.longitud ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="-58.3816"
                />
                {errors.longitud && (
                  <p className="text-red-500 text-xs mt-1">{errors.longitud}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cultivo Actual *
              </label>
              <select
                name="cultivo_actual"
                value={formData.cultivo_actual}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.cultivo_actual ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Seleccionar cultivo</option>
                {cultivosOptions.map((cultivo) => (
                  <option key={cultivo.value} value={cultivo.label}>
                    {cultivo.label}
                  </option>
                ))}
              </select>
              {errors.cultivo_actual && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.cultivo_actual}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Crear Campo
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
