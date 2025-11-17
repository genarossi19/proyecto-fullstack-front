import type React from "react";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { updateMachinery } from "../api/services/MachineryService";
import { toast } from "sonner";
import type { MachineryType } from "../types/Machinery";
import { MACHINERY_TYPES, MACHINERY_STATUS } from "../constants/machinery";

interface EditMachineryModalProps {
  isOpen: boolean;
  onClose: () => void;
  machinery: MachineryType | null;
  onMachineryUpdated?: () => void;
}

interface FormErrors {
  name?: string;
  type?: string;
  brand?: string;
  model?: string;
  status?: string;
}

export function EditMachineryModal({
  isOpen,
  onClose,
  machinery,
  onMachineryUpdated,
}: EditMachineryModalProps) {
  const [formData, setFormData] = useState<{
    name: string;
    type: string;
    brand: string;
    model: string;
    patent: string;
    status: "En Uso" | "Mantenimiento" | "Disponible" | "Fuera de Servicio";
  }>({
    name: "",
    type: "",
    brand: "",
    model: "",
    patent: "",
    status: "Disponible",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (machinery && isOpen) {
      setFormData({
        name: machinery.name,
        type: machinery.type,
        brand: machinery.brand,
        model: machinery.model,
        patent: machinery.patent || "",
        status: machinery.status,
      });
      setErrors({});
    }
  }, [machinery, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre de la maquinaria es requerido";
    }

    if (!formData.type.trim()) {
      newErrors.type = "El tipo es requerido";
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "La marca es requerida";
    }

    if (!formData.model.trim()) {
      newErrors.model = "El modelo es requerido";
    }

    if (!formData.status) {
      newErrors.status = "El estado es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !machinery) {
      return;
    }

    try {
      setIsSubmitting(true);

      await updateMachinery(machinery.id, {
        id: machinery.id,
        name: formData.name.trim(),
        type: formData.type.trim(),
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        patent: formData.patent.trim() || undefined,
        status: formData.status,
      });

      toast.success("Maquinaria actualizada exitosamente");

      if (onMachineryUpdated) {
        onMachineryUpdated();
      }

      onClose();
    } catch (error) {
      console.error("Error updating machinery:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error("Error al actualizar la maquinaria", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !machinery) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-black/50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-visible">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            Editar Maquinaria
          </CardTitle>
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label
                  htmlFor="name"
                  className={errors.name ? "text-red-600" : ""}
                >
                  Nombre de la Maquinaria *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Cosechadora Principal"
                  className={`placeholder:text-gray-400 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="type"
                  className={errors.type ? "text-red-600" : ""}
                >
                  Tipo *
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    className={errors.type ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent className="z-50" side="bottom" sideOffset={5}>
                    {MACHINERY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-600 mt-1">{errors.type}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="brand"
                  className={errors.brand ? "text-red-600" : ""}
                >
                  Marca *
                </Label>
                <Input
                  id="brand"
                  name="brand"
                  type="text"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Ej: John Deere"
                  className={`placeholder:text-gray-400 ${
                    errors.brand ? "border-red-500" : ""
                  }`}
                  disabled={isSubmitting}
                />
                {errors.brand && (
                  <p className="text-sm text-red-600 mt-1">{errors.brand}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="model"
                  className={errors.model ? "text-red-600" : ""}
                >
                  Modelo *
                </Label>
                <Input
                  id="model"
                  name="model"
                  type="text"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="Ej: S780"
                  className={`placeholder:text-gray-400 ${
                    errors.model ? "border-red-500" : ""
                  }`}
                  disabled={isSubmitting}
                />
                {errors.model && (
                  <p className="text-sm text-red-600 mt-1">{errors.model}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="patent">Matrícula / Patente</Label>
                <Input
                  id="patent"
                  name="patent"
                  type="text"
                  value={formData.patent}
                  onChange={handleInputChange}
                  placeholder="Ej: ABC123"
                  className="placeholder:text-gray-400"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label
                  htmlFor="status"
                  className={errors.status ? "text-red-600" : ""}
                >
                  Estado *
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value as
                        | "En Uso"
                        | "Mantenimiento"
                        | "Disponible"
                        | "Fuera de Servicio",
                    })
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    className={errors.status ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent className="z-50" side="bottom" sideOffset={5}>
                    {MACHINERY_STATUS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-600 mt-1">{errors.status}</p>
                )}
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
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
