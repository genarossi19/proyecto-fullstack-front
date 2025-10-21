import type React from "react";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { X } from "lucide-react";

interface CreateLotModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldId: number;
  fieldName: string;
  clientName: string;
}

export function CreateLotModal({
  isOpen,
  onClose,
  fieldId,
  fieldName,
  clientName,
}: CreateLotModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    superficie_ha: "",
    id_cultivo: "",
    id_estadio: "",
    latitud: "",
    longitud: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const cultivosOptions = [
    { id: 1, nombre: "Soja" },
    { id: 2, nombre: "Maíz" },
    { id: 3, nombre: "Trigo" },
    { id: 4, nombre: "Girasol" },
    { id: 5, nombre: "Sorgo" },
  ];

  const estadiosOptions = [
    { id: 1, nombre: "Siembra" },
    { id: 2, nombre: "Emergencia" },
    { id: 3, nombre: "Vegetativo" },
    { id: 4, nombre: "Floración" },
    { id: 5, nombre: "Llenado" },
    { id: 6, nombre: "Madurez" },
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
      newErrors.nombre = "El nombre del lote es requerido";
    }

    if (!formData.superficie_ha) {
      newErrors.superficie_ha = "La superficie es requerida";
    } else if (Number.parseFloat(formData.superficie_ha) <= 0) {
      newErrors.superficie_ha = "La superficie debe ser mayor a 0";
    }

    if (!formData.id_cultivo) {
      newErrors.id_cultivo = "El cultivo es requerido";
    }

    if (!formData.id_estadio) {
      newErrors.id_estadio = "El estadio es requerido";
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Here you would typically make an API call to create the lot
    console.log("Creating lot:", {
      ...formData,
      id_campo: fieldId,
      superficie_ha: Number.parseFloat(formData.superficie_ha),
      id_cultivo: Number.parseInt(formData.id_cultivo),
      id_estadio: Number.parseInt(formData.id_estadio),
      latitud: Number.parseFloat(formData.latitud),
      longitud: Number.parseFloat(formData.longitud),
    });

    // Reset form and close modal
    setFormData({
      nombre: "",
      superficie_ha: "",
      id_cultivo: "",
      id_estadio: "",
      latitud: "",
      longitud: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            Crear Nuevo Lote
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Cliente:</strong> {clientName} • <strong>Campo:</strong>{" "}
              {fieldName}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Lote *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.nombre ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ej: Lote A1"
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
                  placeholder="25.5"
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
                  Cultivo *
                </label>
                <select
                  name="id_cultivo"
                  value={formData.id_cultivo}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.id_cultivo ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Seleccionar cultivo</option>
                  {cultivosOptions.map((cultivo) => (
                    <option key={cultivo.id} value={cultivo.id}>
                      {cultivo.nombre}
                    </option>
                  ))}
                </select>
                {errors.id_cultivo && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.id_cultivo}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estadio *
                </label>
                <select
                  name="id_estadio"
                  value={formData.id_estadio}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.id_estadio ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Seleccionar estadio</option>
                  {estadiosOptions.map((estadio) => (
                    <option key={estadio.id} value={estadio.id}>
                      {estadio.nombre}
                    </option>
                  ))}
                </select>
                {errors.id_estadio && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.id_estadio}
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

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Crear Lote
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
