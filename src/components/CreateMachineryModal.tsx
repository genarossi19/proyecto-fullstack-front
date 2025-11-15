import type React from "react";

import { useState } from "react";
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
import { Textarea } from "./ui/textarea";

interface CreateMachineryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateMachineryModal({
  isOpen,
  onClose,
}: CreateMachineryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    brand: "",
    model: "",
    year: "",
    serialNumber: "",
    location: "",
    status: "Disponible",
    purchaseDate: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("[v0] Creating machinery:", formData);
    setIsSubmitting(false);
    onClose();

    setFormData({
      name: "",
      type: "",
      brand: "",
      model: "",
      year: "",
      serialNumber: "",
      location: "",
      status: "Disponible",
      purchaseDate: "",
      notes: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-60 p-4 backdrop-blur-sm bg-black/50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            Nueva Maquinaria
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Nombre de la Maquinaria *</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ej: Cosechadora Principal"
                />
              </div>

              <div>
                <Label htmlFor="type">Tipo *</Label>
                <Select
                  required
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cosechadora">Cosechadora</SelectItem>
                    <SelectItem value="Tractor">Tractor</SelectItem>
                    <SelectItem value="Pulverizadora">Pulverizadora</SelectItem>
                    <SelectItem value="Sembradora">Sembradora</SelectItem>
                    <SelectItem value="Arado">Arado</SelectItem>
                    <SelectItem value="Rastra">Rastra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="brand">Marca *</Label>
                <Input
                  id="brand"
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  placeholder="Ej: John Deere"
                />
              </div>

              <div>
                <Label htmlFor="model">Modelo *</Label>
                <Input
                  id="model"
                  type="text"
                  required
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  placeholder="Ej: S780"
                />
              </div>

              <div>
                <Label htmlFor="year">Año</Label>
                <Input
                  id="year"
                  type="number"
                  min="1900"
                  max="2030"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  placeholder="2023"
                />
              </div>

              <div>
                <Label htmlFor="serialNumber">Número de Serie</Label>
                <Input
                  id="serialNumber"
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, serialNumber: e.target.value })
                  }
                  placeholder="Número de serie"
                />
              </div>

              <div>
                <Label htmlFor="location">Ubicación Actual</Label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Ej: Galpón A, Campo Norte"
                />
              </div>

              <div>
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Disponible">Disponible</SelectItem>
                    <SelectItem value="En Uso">En Uso</SelectItem>
                    <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="Fuera de Servicio">
                      Fuera de Servicio
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="purchaseDate">Fecha de Compra</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, purchaseDate: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="notes">Notas Adicionales</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Información adicional sobre la maquinaria..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                {isSubmitting ? "Creando..." : "Crear Maquinaria"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
