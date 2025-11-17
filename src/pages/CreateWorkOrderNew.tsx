import type React from "react";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { CreateClientModal } from "../components/CreateClientModal";
import { CreateFieldModal } from "../components/CreateFieldModal";
import { CreateLotModal } from "../components/CreateLotModal";
import { useNavigate } from "react-router";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { getAllClients } from "../api/services/ClientService";
import { getAllFields } from "../api/services/FieldService";
import { getAllLots } from "../api/services/LotService";
import { createWorkOrder } from "../api/services/WorkOrderService";
import type { ClientType } from "../types/ClientType";

interface DetailLote {
  lotId: number;
  lotName: string;
}

interface DetailMachinery {
  machineryId: number;
}

export function CreateWorkOrderNew() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clientId: null as number | null,
    fieldId: null as number | null,
    serviceId: null as number | null,
    init_date: new Date().toISOString().split("T")[0],
    finish_date: null as string | null,
    status: "Pendiente",
    observation: "",
    price: null as number | null,
  });

  const [detalleLotes, setDetalleLotes] = useState<DetailLote[]>([]);
  const [detalleMaquinaria, setDetalleMaquinaria] = useState<DetailMachinery[]>(
    []
  );
  const [selectedLotForAdd, setSelectedLotForAdd] = useState<number | null>(
    null
  );

  const [clients, setClients] = useState<ClientType[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [lots, setLots] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isCreateClientModalOpen, setIsCreateClientModalOpen] = useState(false);
  const [isCreateFieldModalOpen, setIsCreateFieldModalOpen] = useState(false);
  const [isCreateLotModalOpen, setIsCreateLotModalOpen] = useState(false);

  const WORK_ORDER_STATUS = [
    "Pendiente",
    "En Progreso",
    "Completado",
    "Cancelado",
  ];

  // Cargar clientes
  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await getAllClients();
        setClients(data);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        toast.error("Error al cargar clientes", {
          description: errorMessage,
        });
      }
    };
    loadClients();
  }, []);

  // Cargar campos cuando cambia el cliente
  useEffect(() => {
    if (!formData.clientId) {
      setFields([]);
      setLots([]);
      setFormData((prev) => ({
        ...prev,
        fieldId: null,
      }));
      return;
    }

    const loadFields = async () => {
      try {
        const allFields = await getAllFields();
        const filtered = allFields.filter(
          (f: any) => f.clientId === formData.clientId
        );
        setFields(filtered);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        toast.error("Error al cargar campos", {
          description: errorMessage,
        });
      }
    };

    loadFields();
  }, [formData.clientId]);

  // Cargar lotes cuando cambia el campo
  useEffect(() => {
    if (!formData.fieldId) {
      setLots([]);
      setDetalleLotes([]);
      return;
    }

    const loadLots = async () => {
      try {
        const allLots = await getAllLots();
        const filtered = allLots.filter(
          (l: any) => l.fieldId === formData.fieldId
        );
        setLots(filtered);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        toast.error("Error al cargar lotes", {
          description: errorMessage,
        });
      }
    };

    loadLots();
  }, [formData.fieldId]);

  const handleClientCreated = async () => {
    try {
      const data = await getAllClients();
      setClients(data);
      setIsCreateClientModalOpen(false);
      toast.success("Cliente creado exitosamente");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error("Error al recargar clientes", {
        description: errorMessage,
      });
    }
  };

  const handleFieldCreated = async () => {
    try {
      const allFields = await getAllFields();
      const filtered = allFields.filter(
        (f: any) => f.clientId === formData.clientId
      );
      setFields(filtered);
      setIsCreateFieldModalOpen(false);
      toast.success("Campo creado exitosamente");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error("Error al recargar campos", {
        description: errorMessage,
      });
    }
  };

  const handleLotCreated = async () => {
    try {
      const allLots = await getAllLots();
      const filtered = allLots.filter(
        (l: any) => l.fieldId === formData.fieldId
      );
      setLots(filtered);
      setIsCreateLotModalOpen(false);
      toast.success("Lote creado exitosamente");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error("Error al recargar lotes", {
        description: errorMessage,
      });
    }
  };

  const addDetalleLote = () => {
    if (!selectedLotForAdd) {
      toast.error("Selecciona un lote");
      return;
    }

    const selectedLot = lots.find((l: any) => l.id === selectedLotForAdd);
    if (!selectedLot) {
      toast.error("Lote no encontrado");
      return;
    }

    const newDetalle: DetailLote = {
      lotId: selectedLot.id,
      lotName: selectedLot.name,
    };

    setDetalleLotes([...detalleLotes, newDetalle]);
    setSelectedLotForAdd(null);
    toast.success("Lote agregado");
  };

  const removeDetalleLote = (index: number) => {
    setDetalleLotes(detalleLotes.filter((_, i) => i !== index));
  };

  const addDetalleMaquinaria = () => {
    setDetalleMaquinaria([...detalleMaquinaria, { machineryId: 0 }]);
  };

  const removeDetalleMaquinaria = (index: number) => {
    setDetalleMaquinaria(detalleMaquinaria.filter((_, i) => i !== index));
  };

  const updateDetalleMaquinaria = (index: number, machineryId: number) => {
    const updated = [...detalleMaquinaria];
    updated[index].machineryId = machineryId;
    setDetalleMaquinaria(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientId || !formData.fieldId || !formData.serviceId) {
      toast.error("Campos requeridos", {
        description: "Completa cliente, campo y servicio",
      });
      return;
    }

    if (detalleLotes.length === 0) {
      toast.error("Lotes requeridos", {
        description: "Agrega al menos un lote a la orden",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const workOrderData = {
        clientId: formData.clientId,
        fieldId: formData.fieldId,
        serviceId: formData.serviceId,
        init_date: formData.init_date,
        finish_date: formData.finish_date,
        status: formData.status,
        observation: formData.observation,
        price: formData.price,
        lotDetails: detalleLotes.map((lote) => ({ lotId: lote.lotId })),
        machineryDetails: detalleMaquinaria.map((maq) => ({
          machineryId: maq.machineryId,
        })),
      };

      await createWorkOrder(workOrderData);
      toast.success("Orden de trabajo creada exitosamente");
      navigate("/work-orders");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error("Error al crear orden de trabajo", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedClient = clients.find((c) => c.id === formData.clientId);
  const selectedField = fields.find((f) => f.id === formData.fieldId);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Nueva Orden de Trabajo
          </h1>
          <p className="text-gray-600 mt-1">
            Completa todos los campos para crear una nueva orden de trabajo.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información General */}
        <Card>
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Información General
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Cliente */}
              <div className="col-span-12 lg:col-span-4">
                <Label htmlFor="cliente" className="mb-2">
                  Cliente <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.clientId ? String(formData.clientId) : ""}
                  onValueChange={(v) => {
                    if (v === "new") {
                      setIsCreateClientModalOpen(true);
                    } else {
                      setFormData({
                        ...formData,
                        clientId: Number(v),
                        fieldId: null,
                      });
                    }
                  }}
                  required
                >
                  <SelectTrigger id="cliente" className="w-full">
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c: any) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="new" className="text-green-600">
                      + Agregar Nuevo Cliente
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Campo */}
              <div className="col-span-12 lg:col-span-4">
                <Label htmlFor="campo" className="mb-2">
                  Campo <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.fieldId ? String(formData.fieldId) : ""}
                  onValueChange={(v) => {
                    if (v === "new") {
                      if (!formData.clientId) {
                        toast.error("Selecciona un cliente primero");
                        return;
                      }
                      setIsCreateFieldModalOpen(true);
                    } else {
                      setFormData({ ...formData, fieldId: Number(v) });
                    }
                  }}
                  disabled={!formData.clientId}
                  required
                >
                  <SelectTrigger id="campo" className="w-full">
                    <SelectValue placeholder="Seleccionar campo" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((f: any) => (
                      <SelectItem key={f.id} value={String(f.id)}>
                        {f.name}
                      </SelectItem>
                    ))}
                    {formData.clientId && (
                      <SelectItem value="new" className="text-green-600">
                        + Agregar Nuevo Campo
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {!formData.clientId && (
                  <p className="mt-1.5 text-xs text-gray-400">
                    Requiere seleccionar cliente
                  </p>
                )}
              </div>

              {/* Servicio */}
              <div className="col-span-12 lg:col-span-4">
                <Label htmlFor="servicio" className="mb-2">
                  Servicio <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.serviceId ? String(formData.serviceId) : ""}
                  onValueChange={(v) =>
                    setFormData({ ...formData, serviceId: Number(v) })
                  }
                  required
                >
                  <SelectTrigger id="servicio" className="w-full">
                    <SelectValue placeholder="Seleccionar servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Cosecha</SelectItem>
                    <SelectItem value="2">Fumigación</SelectItem>
                    <SelectItem value="3">Siembra</SelectItem>
                    <SelectItem value="4">Arado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Fechas */}
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-3">
                <Label htmlFor="init_date" className="mb-2">
                  Fecha Inicio <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="init_date"
                  type="date"
                  value={formData.init_date}
                  onChange={(e) =>
                    setFormData({ ...formData, init_date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-span-12 lg:col-span-3">
                <Label htmlFor="finish_date" className="mb-2">
                  Fecha Fin
                </Label>
                <Input
                  id="finish_date"
                  type="date"
                  value={formData.finish_date || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      finish_date: e.target.value || null,
                    })
                  }
                />
              </div>

              <div className="col-span-12 lg:col-span-3">
                <Label htmlFor="price" className="mb-2">
                  Precio ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </div>

              <div className="col-span-12 lg:col-span-3">
                <Label htmlFor="status" className="mb-2">
                  Estado <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData({ ...formData, status: v })}
                  required
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_ORDER_STATUS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Observación */}
            <div>
              <Label htmlFor="observation" className="mb-2">
                Observación
              </Label>
              <Textarea
                id="observation"
                value={formData.observation}
                onChange={(e) =>
                  setFormData({ ...formData, observation: e.target.value })
                }
                rows={3}
                className="resize-none"
                placeholder="Notas adicionales..."
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-400">Máximo 500 caracteres</p>
                <span className="text-xs text-gray-400 font-mono">
                  {formData.observation.length}/500
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selección de Lotes */}
        <Card>
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Lotes <span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {/* Selector de Lotes */}
            {formData.fieldId && lots.length > 0 && (
              <div className="flex gap-3">
                <Select
                  value={selectedLotForAdd ? String(selectedLotForAdd) : ""}
                  onValueChange={(v) => setSelectedLotForAdd(Number(v))}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Seleccionar lote a agregar" />
                  </SelectTrigger>
                  <SelectContent>
                    {lots.map((lot: any) => (
                      <SelectItem key={lot.id} value={String(lot.id)}>
                        {lot.name} ({lot.area} ha)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addDetalleLote}
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </Button>
              </div>
            )}

            {/* Botones para crear o seleccionar lotes */}
            {formData.fieldId && lots.length === 0 && (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-3">
                  No hay lotes disponibles en este campo
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateLotModalOpen(true)}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Nuevo Lote
                </Button>
              </div>
            )}

            {!formData.fieldId && (
              <div className="text-center py-6 text-gray-500">
                Selecciona un campo primero
              </div>
            )}

            {/* Lista de Lotes Agregados */}
            {detalleLotes.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <Label className="text-sm font-medium text-gray-700">
                  Lotes Agregados ({detalleLotes.length})
                </Label>
                <div className="space-y-2">
                  {detalleLotes.map((lote, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {lote.lotName}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {lote.lotId}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDetalleLote(index)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botón para crear nuevo lote si hay campo seleccionado */}
            {formData.fieldId && detalleLotes.length > 0 && lots.length > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreateLotModalOpen(true)}
                  className="text-green-600 hover:bg-green-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Otro Lote
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botón Guardar */}
        <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-medium text-gray-900">
                  ¿Listo para crear la orden?
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Guardando..." : "Guardar Orden"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <CreateClientModal
        isOpen={isCreateClientModalOpen}
        onClose={() => setIsCreateClientModalOpen(false)}
        onClientCreated={handleClientCreated}
      />

      <CreateFieldModal
        isOpen={isCreateFieldModalOpen}
        onClose={() => setIsCreateFieldModalOpen(false)}
        onFieldCreated={handleFieldCreated}
        clientId={formData.clientId || 0}
        clientName={selectedClient?.name || ""}
      />

      <CreateLotModal
        isOpen={isCreateLotModalOpen}
        onClose={() => setIsCreateLotModalOpen(false)}
        onLotCreated={handleLotCreated}
        fieldId={formData.fieldId || 0}
        fieldName={selectedField?.name || ""}
        clientName={selectedClient?.name || ""}
      />
    </div>
  );
}
