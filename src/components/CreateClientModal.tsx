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
import { Checkbox } from "./ui/checkbox";

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateClientModal({ isOpen, onClose }: CreateClientModalProps) {
  const [formData, setFormData] = useState({
    razon_social: "",
    CUIT: "",
    telefono: "",
    email: "",
    direccion: "",
    altura: "",
    id_condicion_iva: 1,
    id_calle: 1,
    activo: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const condicionesIva = [
    { id: 1, condicion_iva: "Responsable Inscripto" },
    { id: 2, condicion_iva: "Monotributo" },
    { id: 3, condicion_iva: "Exento" },
    { id: 4, condicion_iva: "Consumidor Final" },
  ];

  const calles = [
    { id: 1, nombre_calle: "Av. San Martín" },
    { id: 2, nombre_calle: "Belgrano" },
    { id: 3, nombre_calle: "Mitre" },
    { id: 4, nombre_calle: "Rivadavia" },
    { id: 5, nombre_calle: "9 de Julio" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("[v0] Creating client:", formData);
    setIsSubmitting(false);
    onClose();

    setFormData({
      razon_social: "",
      CUIT: "",
      telefono: "",
      email: "",
      direccion: "",
      altura: "",
      id_condicion_iva: 1,
      id_calle: 1,
      activo: true,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">Nuevo Cliente</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="razonSocial">Razón Social *</Label>
                <Input
                  id="razonSocial"
                  type="text"
                  required
                  value={formData.razon_social}
                  onChange={(e) =>
                    setFormData({ ...formData, razon_social: e.target.value })
                  }
                  placeholder="Ej: Finca San José S.A."
                />
              </div>

              <div>
                <Label htmlFor="cuit">CUIT *</Label>
                <Input
                  id="cuit"
                  type="number"
                  required
                  value={formData.CUIT}
                  onChange={(e) =>
                    setFormData({ ...formData, CUIT: e.target.value })
                  }
                  placeholder="20123456789"
                />
              </div>

              <div>
                <Label htmlFor="condicionIva">Condición IVA *</Label>
                <Select
                  required
                  value={formData.id_condicion_iva.toString()}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      id_condicion_iva: Number.parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar condición IVA" />
                  </SelectTrigger>
                  <SelectContent>
                    {condicionesIva.map((condicion) => (
                      <SelectItem
                        key={condicion.id}
                        value={condicion.id.toString()}
                      >
                        {condicion.condicion_iva}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  placeholder="+54 11 1234-5678"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="contacto@empresa.com"
                />
              </div>

              <div>
                <Label htmlFor="calle">Calle *</Label>
                <Select
                  required
                  value={formData.id_calle.toString()}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      id_calle: Number.parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar calle" />
                  </SelectTrigger>
                  <SelectContent>
                    {calles.map((calle) => (
                      <SelectItem key={calle.id} value={calle.id.toString()}>
                        {calle.nombre_calle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="altura">Altura *</Label>
                <Input
                  id="altura"
                  type="number"
                  required
                  value={formData.altura}
                  onChange={(e) =>
                    setFormData({ ...formData, altura: e.target.value })
                  }
                  placeholder="1250"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="direccion">Dirección Completa</Label>
                <Input
                  id="direccion"
                  type="text"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                  placeholder="Se completará automáticamente: [Calle] [Altura]"
                  disabled
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="activo"
                    checked={formData.activo}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, activo: checked as boolean })
                    }
                  />
                  <Label
                    htmlFor="activo"
                    className="text-sm font-medium text-gray-700"
                  >
                    Cliente Activo
                  </Label>
                </div>
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
                {isSubmitting ? "Creando..." : "Crear Cliente"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
