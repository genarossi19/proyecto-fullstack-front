import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { X } from "lucide-react";
import { updateField } from "../api/services/FieldService";
import { toast } from "sonner";
import type FieldType from "../types/FieldType";

interface EditFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: FieldType | null;
  clientName: string;
  onFieldUpdated?: () => void;
}

export function EditFieldModal({
  isOpen,
  onClose,
  field,
  clientName,
  onFieldUpdated,
}: EditFieldModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    area: "",
    lat: "",
    long: "",
    active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (field && isOpen) {
      setFormData({
        name: field.name,
        area: field.area.toString(),
        lat: field.lat.toString(),
        long: field.long.toString(),
        active: field.active,
      });
      setErrors({});
    }
  }, [field, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre del campo es requerido";
    }

    if (!formData.area) {
      newErrors.area = "La superficie es requerida";
    } else if (Number.parseFloat(formData.area) <= 0) {
      newErrors.area = "La superficie debe ser mayor a 0";
    }

    if (!formData.lat) {
      newErrors.lat = "La latitud es requerida";
    } else if (isNaN(Number.parseFloat(formData.lat))) {
      newErrors.lat = "La latitud debe ser un número válido";
    }

    if (!formData.long) {
      newErrors.long = "La longitud es requerida";
    } else if (isNaN(Number.parseFloat(formData.long))) {
      newErrors.long = "La longitud debe ser un número válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !field) {
      return;
    }

    try {
      setIsUpdating(true);

      await updateField(field.id, {
        id: field.id,
        name: formData.name,
        area: Number.parseFloat(formData.area),
        lat: Number.parseFloat(formData.lat),
        long: Number.parseFloat(formData.long),
        active: formData.active,
        clientId: field.clientId,
      });

      toast.success("Campo actualizado exitosamente");

      // Call callback if provided
      if (onFieldUpdated) {
        onFieldUpdated();
      }

      onClose();
    } catch (error) {
      console.error("Error updating field:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error("Error al actualizar el campo", {
        description: errorMessage,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen || !field) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-60 p-4 backdrop-blur-sm bg-black/50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">Editar Campo</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Cliente:</strong> {clientName} •{" "}
              <strong>Campo ID:</strong> CAM-
              {field.id.toString().padStart(3, "0")}
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
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ej: Campo Norte"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Superficie (hectáreas) *
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.area ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="150.5"
                />
                {errors.area && (
                  <p className="text-red-500 text-xs mt-1">{errors.area}</p>
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
                  name="lat"
                  value={formData.lat}
                  onChange={handleInputChange}
                  step="any"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.lat ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="-34.6037"
                />
                {errors.lat && (
                  <p className="text-red-500 text-xs mt-1">{errors.lat}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitud *
                </label>
                <input
                  type="number"
                  name="long"
                  value={formData.long}
                  onChange={handleInputChange}
                  step="any"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.long ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="-58.3816"
                />
                {errors.long && (
                  <p className="text-red-500 text-xs mt-1">{errors.long}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="active"
                className="text-sm font-medium text-gray-700"
              >
                Campo Activo
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isUpdating}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isUpdating}
              >
                {isUpdating ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
