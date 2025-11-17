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
import { CreateMachineryModal } from "../components/CreateMachineryModal";
import { useNavigate, useLocation } from "react-router";
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
import { getAllFields, getFieldById } from "../api/services/FieldService";
import { createWorkOrder } from "../api/services/WorkOrderService";
import { getAllMachineries } from "../api/services/MachineryService";
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
  const location = useLocation();
  const preselectedClientId = (location.state as { clientId?: number })
    ?.clientId;

  const [formData, setFormData] = useState({
    clientId: preselectedClientId || (null as number | null),
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
  const [showLotSelector, setShowLotSelector] = useState(false);
  const [showMachinerySelectors, setShowMachinerySelectors] = useState(false);

  const [clients, setClients] = useState<ClientType[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [lots, setLots] = useState<any[]>([]);
  const [machineries, setMachineries] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isCreateClientModalOpen, setIsCreateClientModalOpen] = useState(false);
  const [isCreateFieldModalOpen, setIsCreateFieldModalOpen] = useState(false);
  const [isCreateLotModalOpen, setIsCreateLotModalOpen] = useState(false);
  const [isCreateMachineryModalOpen, setIsCreateMachineryModalOpen] =
    useState(false);

  const WORK_ORDER_STATUS = [
    "Pendiente",
    "En Progreso",
    "Completado",
    "Cancelado",
  ];

  // Cargar clientes y maquinaria
  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, machineriesData] = await Promise.all([
          getAllClients(),
          getAllMachineries(),
        ]);
        setClients(clientsData);
        setMachineries(machineriesData);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        toast.error("Error al cargar datos", {
          description: errorMessage,
        });
      }
    };
    loadData();
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
        const fieldData = await getFieldById(formData.fieldId as number);
        setLots(fieldData?.lots || []);
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
      const fieldData = await getFieldById(formData.fieldId || 0);
      setLots(fieldData?.lots || []);
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

  const handleMachineryCreated = async () => {
    try {
      const data = await getAllMachineries();
      setMachineries(data);
      setIsCreateMachineryModalOpen(false);
      toast.success("Maquinaria creada exitosamente");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error("Error al recargar maquinaria", {
        description: errorMessage,
      });
    }
  };

  const removeDetalleLote = (index: number) => {
    setDetalleLotes(detalleLotes.filter((_, i) => i !== index));
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
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Lotes <span className="text-red-500">*</span>
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsCreateLotModalOpen(true)}
                className="text-green-600 hover:bg-green-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Crear Lote
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {/* Selector de Lotes - Solo visible si hay campo y se habilita */}
            {formData.fieldId && lots.length > 0 && (
              <>
                {!showLotSelector ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50"
                    onClick={() => setShowLotSelector(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Lote
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Select
                      value={selectedLotForAdd ? String(selectedLotForAdd) : ""}
                      onValueChange={(v) => {
                        const lotId = Number(v);
                        setSelectedLotForAdd(lotId);
                        const selectedLot = lots.find(
                          (l: unknown) => (l as { id: number }).id === lotId
                        );
                        if (selectedLot) {
                          const newDetalle: DetailLote = {
                            lotId: (selectedLot as { id: number }).id,
                            lotName: (selectedLot as { name: string }).name,
                          };
                          setDetalleLotes([...detalleLotes, newDetalle]);
                          setSelectedLotForAdd(null);
                          setShowLotSelector(false);
                          toast.success("Lote agregado");
                        }
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Seleccionar lote" />
                      </SelectTrigger>
                      <SelectContent>
                        {lots.map((lot: unknown) => (
                          <SelectItem
                            key={(lot as { id: number }).id}
                            value={String((lot as { id: number }).id)}
                          >
                            {(lot as { name: string }).name} (
                            {(lot as { area: number }).area} ha)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowLotSelector(false)}
                      className="text-gray-600 hover:bg-gray-100"
                    >
                      ✕
                    </Button>
                  </div>
                )}
              </>
            )}

            {formData.fieldId && lots.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-600 text-sm mb-3">
                  No hay lotes disponibles en este campo
                </p>
              </div>
            )}

            {!formData.fieldId && (
              <div className="text-center py-4 text-gray-500 text-sm">
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
          </CardContent>
        </Card>

        {/* Asignación de Maquinaria */}
        <Card>
          <CardHeader className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Asignación de Maquinaria
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsCreateMachineryModalOpen(true)}
                className="text-green-600 hover:bg-green-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Crear Maquinaria
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {/* Botón para agregar selectores */}
            {machineries.length > 0 && (
              <>
                {!showMachinerySelectors ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50"
                    onClick={() => {
                      setDetalleMaquinaria([
                        ...detalleMaquinaria,
                        { machineryId: 0 },
                      ]);
                      setShowMachinerySelectors(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Maquinaria
                  </Button>
                ) : null}
              </>
            )}

            {/* Lista de Maquinaria Agregada */}
            {detalleMaquinaria.length > 0 ? (
              <div className="space-y-3">
                {detalleMaquinaria.map((machinery, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <Select
                      value={
                        machinery.machineryId
                          ? String(machinery.machineryId)
                          : ""
                      }
                      onValueChange={(v) =>
                        updateDetalleMaquinaria(index, Number(v))
                      }
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Seleccionar maquinaria" />
                      </SelectTrigger>
                      <SelectContent>
                        {machineries.map((m: unknown) => (
                          <SelectItem
                            key={(m as { id: number }).id}
                            value={String((m as { id: number }).id)}
                          >
                            {(m as { name: string }).name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDetalleMaquinaria(index)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                {/* Botón para agregar más maquinaria */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                  onClick={() => {
                    setDetalleMaquinaria([
                      ...detalleMaquinaria,
                      { machineryId: 0 },
                    ]);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Otra Maquinaria
                </Button>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                {machineries.length === 0
                  ? "No hay maquinaria disponible"
                  : "Sin maquinaria asignada"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botón Guardar */}
        <Card className="bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200">
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
                className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
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

      <CreateMachineryModal
        isOpen={isCreateMachineryModalOpen}
        onClose={() => setIsCreateMachineryModalOpen(false)}
        onMachineryCreated={handleMachineryCreated}
      />
    </div>
  );
}
