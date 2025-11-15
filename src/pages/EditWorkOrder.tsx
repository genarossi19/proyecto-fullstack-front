import type React from "react";

import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
interface EditWorkOrderProps {
  workOrderId: number;
}

export function EditWorkOrder({ workOrderId }: EditWorkOrderProps) {
  const navigate = useNavigate();
  // Mock initial data - replace with actual data fetching
  const [formData, setFormData] = useState({
    id_cliente: "1",
    id_campo: "1",
    id_presupuesto: "1",
    id_servicio: "1",
    fecha_emision: "2024-01-10",
    fecha_inicio: "2024-01-12",
    fecha_fin: "2024-01-15",
    campaña: "2024/25",
    estado: "En Progreso",
    observaciones: "Cosecha de maíz en lote principal",
  });

  const [detalleLotes, setDetalleLotes] = useState([
    {
      id_lote: "1",
      id_estadio: "1",
      id_cultivo: "1",
      superficie_ha: "45.5",
      latitud: "-34.5678",
      longitud: "-58.1234",
    },
  ]);

  const [detalleMaquinaria, setDetalleMaquinaria] = useState([
    {
      id_maquinaria: "1",
      id_empleado: "1",
      observaciones: "Turno mañana",
    },
  ]);

  const [detalleProducto, setDetalleProducto] = useState([
    {
      id_producto: "1",
      dosis: "2.5",
    },
  ]);

  const [isCreateClientModalOpen, setIsCreateClientModalOpen] = useState(false);
  const [isCreateFieldModalOpen, setIsCreateFieldModalOpen] = useState(false);
  const [isCreateLotModalOpen, setIsCreateLotModalOpen] = useState(false);
  const [currentLotDetailIndex, setCurrentLotDetailIndex] = useState<
    number | undefined
  >(undefined);

  const [clientes, setClientes] = useState([
    { id_cliente: 1, razon_social: "Finca San José" },
    { id_cliente: 2, razon_social: "Agropecuaria Norte" },
    { id_cliente: 3, razon_social: "Campo Verde" },
  ]);

  const [campos, setCampos] = useState([
    { id_campo: 1, nombre: "Campo Norte", id_cliente: 1 },
    { id_campo: 2, nombre: "Lote B", id_cliente: 2 },
    { id_campo: 3, nombre: "Lote C", id_cliente: 3 },
  ]);

  const [lotes, setLotes] = useState([
    { id_lote: 1, nombre: "Lote A1", id_campo: 1 },
    { id_lote: 2, nombre: "Lote A2", id_campo: 1 },
    { id_lote: 3, nombre: "Lote B1", id_campo: 2 },
  ]);

  // Mock budgets data - filtered by client
  const [budgets] = useState([
    {
      id_presupuesto: 1,
      numero: "PRES-001",
      servicio: "Cosecha de Maíz",
      id_cliente: 1,
      estado: "Aprobado",
    },
    {
      id_presupuesto: 2,
      numero: "PRES-002",
      servicio: "Fumigación de Soja",
      id_cliente: 2,
      estado: "Aprobado",
    },
    {
      id_presupuesto: 3,
      numero: "PRES-003",
      servicio: "Siembra de Trigo",
      id_cliente: 1,
      estado: "Pendiente",
    },
  ]);

  const servicios = [
    { id_servicio: 1, nombre_servicio: "Cosecha de Maíz" },
    { id_servicio: 2, nombre_servicio: "Fumigación de Soja" },
    { id_servicio: 3, nombre_servicio: "Siembra de Trigo" },
  ];

  const maquinarias = [
    { id_maquinaria: 1, patente: "ABC123", modelo: "John Deere 9600" },
    { id_maquinaria: 2, patente: "DEF456", modelo: "Case IH 8230" },
    { id_maquinaria: 3, patente: "GHI789", modelo: "New Holland CR9090" },
  ];

  const empleados = [
    { id_empleado: 1, nombre: "Juan", apellido: "Pérez" },
    { id_empleado: 2, nombre: "María", apellido: "González" },
    { id_empleado: 3, nombre: "Carlos", apellido: "López" },
  ];

  const productos = [
    { id_producto: 1, nombre: "Glifosato 48%" },
    { id_producto: 2, nombre: "2,4-D Amina" },
    { id_producto: 3, nombre: "Atrazina 50%" },
  ];

  const cultivos = [
    { id_cultivo: 1, nombre: "Maíz" },
    { id_cultivo: 2, nombre: "Soja" },
    { id_cultivo: 3, nombre: "Trigo" },
  ];

  const estadios = [
    { id_estadio: 1, nombre: "V6" },
    { id_estadio: 2, nombre: "R1" },
    { id_estadio: 3, nombre: "R3" },
  ];

  const filteredCampos = campos.filter(
    (campo) =>
      !formData.id_cliente ||
      campo.id_cliente.toString() === formData.id_cliente
  );

  const filteredLotes = lotes.filter(
    (lote) =>
      !formData.id_campo || lote.id_campo.toString() === formData.id_campo
  );

  const filteredBudgets = budgets.filter(
    (budget) =>
      !formData.id_cliente ||
      budget.id_cliente.toString() === formData.id_cliente
  );

  const onBack = () => {
    navigate(-1);
  };

  const handleClientCreated = (newClient: any) => {
    const clientWithId = { ...newClient, id_cliente: clientes.length + 1 };
    setClientes([...clientes, clientWithId]);
    setFormData({
      ...formData,
      id_cliente: clientWithId.id_cliente.toString(),
    });
    setIsCreateClientModalOpen(false);
  };

  const handleFieldCreated = (newField: any) => {
    const fieldWithId = {
      ...newField,
      id_campo: campos.length + 1,
      id_cliente: Number.parseInt(formData.id_cliente),
    };
    setCampos([...campos, fieldWithId]);
    setFormData({ ...formData, id_campo: fieldWithId.id_campo.toString() });
    setIsCreateFieldModalOpen(false);
  };

  const handleLotCreated = (newLot: any, lotDetailIndex?: number) => {
    const lotWithId = {
      ...newLot,
      id_lote: lotes.length + 1,
      id_campo: Number.parseInt(formData.id_campo),
    };
    setLotes([...lotes, lotWithId]);

    if (lotDetailIndex !== undefined) {
      const newDetalleLotes = [...detalleLotes];
      newDetalleLotes[lotDetailIndex].id_lote = lotWithId.id_lote.toString();
      setDetalleLotes(newDetalleLotes);
    }

    setIsCreateLotModalOpen(false);
  };

  const addDetalleLote = () => {
    setDetalleLotes([
      ...detalleLotes,
      {
        id_lote: "",
        id_estadio: "",
        id_cultivo: "",
        superficie_ha: "",
        latitud: "",
        longitud: "",
      },
    ]);
  };

  const removeDetalleLote = (index: number) => {
    setDetalleLotes(detalleLotes.filter((_, i) => i !== index));
  };

  const addDetalleMaquinaria = () => {
    setDetalleMaquinaria([
      ...detalleMaquinaria,
      {
        id_maquinaria: "",
        id_empleado: "",
        observaciones: "",
      },
    ]);
  };

  const removeDetalleMaquinaria = (index: number) => {
    setDetalleMaquinaria(detalleMaquinaria.filter((_, i) => i !== index));
  };

  const addDetalleProducto = () => {
    setDetalleProducto([
      ...detalleProducto,
      {
        id_producto: "",
        dosis: "",
      },
    ]);
  };

  const removeDetalleProducto = (index: number) => {
    setDetalleProducto(detalleProducto.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[v0] Updating work order:", workOrderId, {
      ...formData,
      detalleLotes,
      detalleMaquinaria,
      detalleProducto,
    });
    onBack();
  };

  const selectedClient = clientes.find(
    (c) => c.id_cliente.toString() === formData.id_cliente
  );
  const selectedField = campos.find(
    (c) => c.id_campo.toString() === formData.id_campo
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Editar Orden OT-{workOrderId.toString().padStart(3, "0")}
          </h1>
          <p className="text-gray-600 mt-1">
            Modifica los campos necesarios para actualizar la orden de trabajo.
          </p>
        </div>
      </div>

      <form id="work-order-form" onSubmit={handleSubmit} className="space-y-6">
        {/* General Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Cliente */}
            <div className="w-full">
              <Label htmlFor="cliente">Cliente *</Label>
              <Select
                value={formData.id_cliente?.toString() || ""}
                onValueChange={(value) => {
                  if (value === "new") {
                    setIsCreateClientModalOpen(true);
                  } else {
                    setFormData({
                      ...formData,
                      id_cliente: value,
                      id_campo: "",
                      id_presupuesto: "",
                    });
                  }
                }}
              >
                <SelectTrigger id="cliente" className="w-full">
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {clientes.map((cliente) => (
                    <SelectItem
                      key={cliente.id_cliente}
                      value={cliente.id_cliente.toString()}
                    >
                      {cliente.razon_social}
                    </SelectItem>
                  ))}
                  <SelectItem
                    value="new"
                    className="text-green-600 font-medium"
                  >
                    + Agregar Nuevo Cliente
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campo */}
            <div className="w-full">
              <Label htmlFor="campo">Campo *</Label>
              <Select
                value={formData.id_campo?.toString() || ""}
                onValueChange={(value) => {
                  if (value === "new") {
                    if (!formData.id_cliente) {
                      alert("Primero selecciona un cliente");
                      return;
                    }
                    setIsCreateFieldModalOpen(true);
                  } else {
                    setFormData({ ...formData, id_campo: value });
                  }
                }}
                disabled={!formData.id_cliente}
              >
                <SelectTrigger id="campo" className="w-full">
                  <SelectValue placeholder="Seleccionar campo" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {filteredCampos.map((campo) => (
                    <SelectItem
                      key={campo.id_campo}
                      value={campo.id_campo.toString()}
                    >
                      {campo.nombre}
                    </SelectItem>
                  ))}
                  {formData.id_cliente && (
                    <SelectItem
                      value="new"
                      className="text-green-600 font-medium"
                    >
                      + Agregar Nuevo Campo
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Presupuesto */}
            <div className="w-full">
              <Label htmlFor="presupuesto">
                Presupuesto Relacionado (Opcional)
              </Label>
              <Select
                value={formData.id_presupuesto?.toString() || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, id_presupuesto: value })
                }
                disabled={!formData.id_cliente}
              >
                <SelectTrigger id="presupuesto" className="w-full">
                  <SelectValue placeholder="Sin presupuesto" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {filteredBudgets.map((budget) => (
                    <SelectItem
                      key={budget.id_presupuesto}
                      value={budget.id_presupuesto.toString()}
                    >
                      {budget.numero} - {budget.servicio} ({budget.estado})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Servicio */}
            <div className="w-full">
              <Label htmlFor="servicio">Servicio *</Label>
              <Select
                value={formData.id_servicio?.toString() || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, id_servicio: value })
                }
              >
                <SelectTrigger id="servicio" className="w-full">
                  <SelectValue placeholder="Seleccionar servicio" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {servicios.map((servicio) => (
                    <SelectItem
                      key={servicio.id_servicio}
                      value={servicio.id_servicio.toString()}
                    >
                      {servicio.nombre_servicio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fecha Emisión */}
            <div>
              <Label htmlFor="fecha_emision">Fecha Emisión *</Label>
              <Input
                id="fecha_emision"
                type="date"
                value={formData.fecha_emision}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_emision: e.target.value })
                }
                required
                className="w-full"
              />
            </div>

            {/* Fecha Inicio */}
            <div>
              <Label htmlFor="fecha_inicio">Fecha Inicio *</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_inicio: e.target.value })
                }
                required
                className="w-full"
              />
            </div>

            {/* Fecha Fin */}
            <div>
              <Label htmlFor="fecha_fin">Fecha Fin</Label>
              <Input
                id="fecha_fin"
                type="date"
                value={formData.fecha_fin}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_fin: e.target.value })
                }
                className="w-full"
              />
            </div>

            {/* Campaña */}
            <div>
              <Label htmlFor="campaña">Campaña *</Label>
              <Input
                id="campaña"
                type="text"
                value={formData.campaña}
                onChange={(e) =>
                  setFormData({ ...formData, campaña: e.target.value })
                }
                required
                className="w-full"
              />
            </div>

            {/* Estado */}
            <div>
              <Label htmlFor="estado">Estado *</Label>
              <Select
                value={formData.estado || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, estado: value })
                }
              >
                <SelectTrigger id="estado" className="w-full">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En Progreso">En Progreso</SelectItem>
                  <SelectItem value="Completado">Completado</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Observaciones */}
            <div className="md:col-span-2 lg:col-span-3">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) =>
                  setFormData({ ...formData, observaciones: e.target.value })
                }
                rows={3}
                placeholder="Observaciones adicionales..."
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Detalle de Lotes */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Detalle de Lotes
            </CardTitle>
            <div className="flex gap-2">
              {formData.id_campo && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                  onClick={() => setIsCreateLotModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Lote
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-green-600 hover:text-green-600/90 !border-green-600/30"
                onClick={addDetalleLote}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Lote
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {detalleLotes.map((lote, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">
                    Lote {index + 1}
                  </h4>
                  {detalleLotes.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => removeDetalleLote(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Lote */}
                  <div>
                    <Label htmlFor={`lote-${index}`}>Lote *</Label>
                    <Select
                      id={`lote-${index}`}
                      value={lote.id_lote?.toString() || ""}
                      onValueChange={(value) => {
                        if (value === "new") {
                          if (!formData.id_campo)
                            return alert("Primero selecciona un campo");
                          setCurrentLotDetailIndex(index);
                          setIsCreateLotModalOpen(true);
                        } else {
                          const newDetalleLotes = [...detalleLotes];
                          newDetalleLotes[index].id_lote = value;
                          setDetalleLotes(newDetalleLotes);
                        }
                      }}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder="Seleccionar lote"
                          value={lote.id_lote || undefined}
                        />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {filteredLotes.map((l) => (
                          <SelectItem
                            key={l.id_lote}
                            value={l.id_lote.toString()}
                          >
                            {l.nombre}
                          </SelectItem>
                        ))}
                        {formData.id_campo && (
                          <SelectItem
                            value="new"
                            className="text-green-600 font-medium"
                          >
                            + Agregar Nuevo Lote
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cultivo */}
                  <div>
                    <Label htmlFor={`cultivo-${index}`}>Cultivo *</Label>
                    <Select
                      id={`cultivo-${index}`}
                      value={lote.id_cultivo?.toString() || ""}
                      onValueChange={(value) => {
                        const newDetalleLotes = [...detalleLotes];
                        newDetalleLotes[index].id_cultivo = value;
                        setDetalleLotes(newDetalleLotes);
                      }}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder="Seleccionar cultivo"
                          value={lote.id_cultivo?.toString() || undefined}
                        />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {cultivos.map((c) => (
                          <SelectItem
                            key={c.id_cultivo}
                            value={c.id_cultivo.toString()}
                          >
                            {c.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Estadio */}
                  <div>
                    <Label htmlFor={`estadio-${index}`}>Estadio *</Label>
                    <Select
                      id={`estadio-${index}`}
                      value={lote.id_estadio?.toString() || ""}
                      onValueChange={(value) => {
                        const newDetalleLotes = [...detalleLotes];
                        newDetalleLotes[index].id_estadio = value;
                        setDetalleLotes(newDetalleLotes);
                      }}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder="Seleccionar estadio"
                          value={lote.id_estadio?.toString() || undefined}
                        />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {estadios.map((e) => (
                          <SelectItem
                            key={e.id_estadio}
                            value={e.id_estadio.toString()}
                          >
                            {e.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Superficie */}
                  <div>
                    <Label htmlFor={`superficie-${index}`}>
                      Superficie (ha) *
                    </Label>
                    <Input
                      id={`superficie-${index}`}
                      type="number"
                      step={0.1}
                      value={lote.superficie_ha}
                      onChange={(e) => {
                        const newDetalleLotes = [...detalleLotes];
                        newDetalleLotes[index].superficie_ha = e.target.value;
                        setDetalleLotes(newDetalleLotes);
                      }}
                      required
                    />
                  </div>

                  {/* Latitud */}
                  <div>
                    <Label htmlFor={`latitud-${index}`}>Latitud</Label>
                    <Input
                      id={`latitud-${index}`}
                      type="number"
                      step={0.000001}
                      value={lote.latitud}
                      onChange={(e) => {
                        const newDetalleLotes = [...detalleLotes];
                        newDetalleLotes[index].latitud = e.target.value;
                        setDetalleLotes(newDetalleLotes);
                      }}
                    />
                  </div>

                  {/* Longitud */}
                  <div>
                    <Label htmlFor={`longitud-${index}`}>Longitud</Label>
                    <Input
                      id={`longitud-${index}`}
                      type="number"
                      step={0.000001}
                      value={lote.longitud}
                      onChange={(e) => {
                        const newDetalleLotes = [...detalleLotes];
                        newDetalleLotes[index].longitud = e.target.value;
                        setDetalleLotes(newDetalleLotes);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Detalle de Maquinaria */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Asignación de Maquinaria
            </CardTitle>
            <Button
              type="button"
              onClick={addDetalleMaquinaria}
              variant="outline"
              size="sm"
              className="text-green-600 hover:text-green-600/90 !border-green-600/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Maquinaria
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            {detalleMaquinaria.map((maquinaria: any, index: number) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">
                    Maquinaria {index + 1}
                  </h4>
                  {detalleMaquinaria.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDetalleMaquinaria(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <Label htmlFor={`maquinaria-${index}`} className="mb-2">
                      Maquinaria *
                    </Label>
                    <Select
                      value={
                        maquinaria.id_maquinaria
                          ? String(maquinaria.id_maquinaria)
                          : ""
                      }
                      onValueChange={(value) => {
                        const newDetalle = [...detalleMaquinaria];
                        newDetalle[index].id_maquinaria = Number(value);
                        setDetalleMaquinaria(newDetalle);
                      }}
                    >
                      <SelectTrigger
                        id={`maquinaria-${index}`}
                        className="w-full"
                      >
                        <SelectValue placeholder="Seleccionar maquinaria" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {maquinarias.map((maq: any) => (
                          <SelectItem
                            key={maq.id_maquinaria}
                            value={String(maq.id_maquinaria)}
                          >
                            {maq.patente} - {maq.modelo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col">
                    <Label htmlFor={`operador-${index}`} className="mb-2">
                      Operador *
                    </Label>
                    <Select
                      value={
                        maquinaria.id_empleado
                          ? String(maquinaria.id_empleado)
                          : ""
                      }
                      onValueChange={(value) => {
                        const newDetalle = [...detalleMaquinaria];
                        newDetalle[index].id_empleado = Number(value);
                        setDetalleMaquinaria(newDetalle);
                      }}
                    >
                      <SelectTrigger
                        id={`operador-${index}`}
                        className="w-full"
                      >
                        <SelectValue placeholder="Seleccionar operador" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {empleados.map((empleado: any) => (
                          <SelectItem
                            key={empleado.id_empleado}
                            value={String(empleado.id_empleado)}
                          >
                            {empleado.nombre} {empleado.apellido}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col">
                    <Label htmlFor={`observaciones-${index}`} className="mb-2">
                      Observaciones
                    </Label>
                    <Input
                      id={`observaciones-${index}`}
                      type="text"
                      value={maquinaria.observaciones}
                      onChange={(e) => {
                        const newDetalle = [...detalleMaquinaria];
                        newDetalle[index].observaciones = e.target.value;
                        setDetalleMaquinaria(newDetalle);
                      }}
                      placeholder="Observaciones específicas..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Detalle de Productos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Productos Aplicados
            </CardTitle>
            <Button
              type="button"
              variant={"outline"}
              onClick={addDetalleProducto}
              size="sm"
              className="text-green-600 hover:text-green-600/90 !border-green-600/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Producto
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {detalleProducto.map((producto, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">
                    Producto {index + 1}
                  </h4>
                  {detalleProducto.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDetalleProducto(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Producto *
                    </label>
                    <select
                      value={producto.id_producto}
                      onChange={(e) => {
                        const newDetalleProducto = [...detalleProducto];
                        newDetalleProducto[index].id_producto = e.target.value;
                        setDetalleProducto(newDetalleProducto);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Seleccionar producto</option>
                      {productos.map((prod) => (
                        <option key={prod.id_producto} value={prod.id_producto}>
                          {prod.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dosis (L/ha o kg/ha) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={producto.dosis}
                      onChange={(e) => {
                        const newDetalleProducto = [...detalleProducto];
                        newDetalleProducto[index].dosis = e.target.value;
                        setDetalleProducto(newDetalleProducto);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
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
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    ¿Listo para guardar la orden editada?
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Revisa que todos los cambios sean correctos antes de
                    continuar
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="hover:cursor-pointer w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-6 text-base font-semibold"
              >
                <Save className="w-5 h-5 mr-2" />
                Guardar Cambios
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
        clientId={Number.parseInt(formData.id_cliente)}
        clientName={selectedClient?.razon_social || ""}
      />

      <CreateLotModal
        isOpen={isCreateLotModalOpen}
        onClose={() => setIsCreateLotModalOpen(false)}
        onLotCreated={(newLot) =>
          handleLotCreated(newLot, currentLotDetailIndex)
        }
        fieldId={Number.parseInt(formData.id_campo)}
        fieldName={selectedField?.nombre || ""}
        clientName={selectedClient?.razon_social || ""}
      />
    </div>
  );
}
