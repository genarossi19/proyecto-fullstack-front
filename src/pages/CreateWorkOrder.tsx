import type React from "react";
import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { useNavigate } from "react-router";
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

export function CreateWorkOrder() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id_cliente: "",
    id_campo: "",
    id_presupuesto: "",
    id_servicio: "",
    fecha_emision: new Date().toISOString().split("T")[0],
    fecha_inicio: "",
    fecha_fin: "",
    campaña: "2024/25",
    estado: "Pendiente",
    observaciones: "",
  });

  const [detalleLotes, setDetalleLotes] = useState([
    {
      id_lote: "",
      id_estadio: "",
      id_cultivo: "",
      superficie_ha: "",
      latitud: "",
      longitud: "",
    },
  ]);

  const [detalleMaquinaria, setDetalleMaquinaria] = useState([
    {
      id_maquinaria: "",
      id_empleado: "",
      observaciones: "",
    },
  ]);

  const [detalleProducto, setDetalleProducto] = useState([
    {
      id_producto: "",
      dosis: "",
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
    console.log("Orden de trabajo:", {
      ...formData,
      detalleLotes,
      detalleMaquinaria,
      detalleProducto,
    });
    // Here you would send the data to your backend
    navigate("/work-orders");
  };

  const selectedClient = clientes.find(
    (c) => c.id_cliente.toString() === formData.id_cliente
  );
  const selectedField = campos.find(
    (c) => c.id_campo.toString() === formData.id_campo
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/work-orders")}>
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
        <Button
          type="submit"
          form="work-order-form"
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Guardar Orden
        </Button>
      </div>

      <form id="work-order-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente *
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.id_cliente}
                  onChange={(e) => {
                    if (e.target.value === "new") {
                      setIsCreateClientModalOpen(true);
                    } else {
                      setFormData({
                        ...formData,
                        id_cliente: e.target.value,
                        id_campo: "",
                      });
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Seleccionar cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id_cliente} value={cliente.id_cliente}>
                      {cliente.razon_social}
                    </option>
                  ))}
                  <option value="new" className="text-green-600 font-medium">
                    + Agregar Nuevo Cliente
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campo *
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.id_campo}
                  onChange={(e) => {
                    if (e.target.value === "new") {
                      if (!formData.id_cliente) {
                        alert("Primero selecciona un cliente");
                        return;
                      }
                      setIsCreateFieldModalOpen(true);
                    } else {
                      setFormData({ ...formData, id_campo: e.target.value });
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  disabled={!formData.id_cliente}
                >
                  <option value="">Seleccionar campo</option>
                  {filteredCampos.map((campo) => (
                    <option key={campo.id_campo} value={campo.id_campo}>
                      {campo.nombre}
                    </option>
                  ))}
                  {formData.id_cliente && (
                    <option value="new" className="text-green-600 font-medium">
                      + Agregar Nuevo Campo
                    </option>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Servicio *
              </label>
              <select
                value={formData.id_servicio}
                onChange={(e) =>
                  setFormData({ ...formData, id_servicio: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Seleccionar servicio</option>
                {servicios.map((servicio) => (
                  <option
                    key={servicio.id_servicio}
                    value={servicio.id_servicio}
                  >
                    {servicio.nombre_servicio}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Emisión *
              </label>
              <input
                type="date"
                value={formData.fecha_emision}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_emision: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio *
              </label>
              <input
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_inicio: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                value={formData.fecha_fin}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_fin: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaña *
              </label>
              <input
                type="text"
                value={formData.campaña}
                onChange={(e) =>
                  setFormData({ ...formData, campaña: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado *
              </label>
              <select
                value={formData.estado}
                onChange={(e) =>
                  setFormData({ ...formData, estado: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Completado">Completado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) =>
                  setFormData({ ...formData, observaciones: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Observaciones adicionales..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Detalle de Lotes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Detalle de Lotes
            </CardTitle>
            <div className="flex gap-2">
              {formData.id_campo && (
                <Button
                  type="button"
                  onClick={() => setIsCreateLotModalOpen(true)}
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Lote
                </Button>
              )}
              <Button
                type="button"
                onClick={addDetalleLote}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
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
                      onClick={() => removeDetalleLote(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lote *
                    </label>
                    <select
                      value={lote.id_lote}
                      onChange={(e) => {
                        if (e.target.value === "new") {
                          if (!formData.id_campo) {
                            alert("Primero selecciona un campo");
                            return;
                          }
                          setCurrentLotDetailIndex(index);
                          setIsCreateLotModalOpen(true);
                        } else {
                          const newDetalleLotes = [...detalleLotes];
                          newDetalleLotes[index].id_lote = e.target.value;
                          setDetalleLotes(newDetalleLotes);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Seleccionar lote</option>
                      {filteredLotes.map((loteOption) => (
                        <option
                          key={loteOption.id_lote}
                          value={loteOption.id_lote}
                        >
                          {loteOption.nombre}
                        </option>
                      ))}
                      {formData.id_campo && (
                        <option
                          value="new"
                          className="text-green-600 font-medium"
                        >
                          + Agregar Nuevo Lote
                        </option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cultivo *
                    </label>
                    <select
                      value={lote.id_cultivo}
                      onChange={(e) => {
                        const newDetalleLotes = [...detalleLotes];
                        newDetalleLotes[index].id_cultivo = e.target.value;
                        setDetalleLotes(newDetalleLotes);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Seleccionar cultivo</option>
                      {cultivos.map((cultivo) => (
                        <option
                          key={cultivo.id_cultivo}
                          value={cultivo.id_cultivo}
                        >
                          {cultivo.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estadio *
                    </label>
                    <select
                      value={lote.id_estadio}
                      onChange={(e) => {
                        const newDetalleLotes = [...detalleLotes];
                        newDetalleLotes[index].id_estadio = e.target.value;
                        setDetalleLotes(newDetalleLotes);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Seleccionar estadio</option>
                      {estadios.map((estadio) => (
                        <option
                          key={estadio.id_estadio}
                          value={estadio.id_estadio}
                        >
                          {estadio.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Superficie (ha) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={lote.superficie_ha}
                      onChange={(e) => {
                        const newDetalleLotes = [...detalleLotes];
                        newDetalleLotes[index].superficie_ha = e.target.value;
                        setDetalleLotes(newDetalleLotes);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitud
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={lote.latitud}
                      onChange={(e) => {
                        const newDetalleLotes = [...detalleLotes];
                        newDetalleLotes[index].latitud = e.target.value;
                        setDetalleLotes(newDetalleLotes);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitud
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={lote.longitud}
                      onChange={(e) => {
                        const newDetalleLotes = [...detalleLotes];
                        newDetalleLotes[index].longitud = e.target.value;
                        setDetalleLotes(newDetalleLotes);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Maquinaria
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {detalleMaquinaria.map((maquinaria, index) => (
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maquinaria *
                    </label>
                    <select
                      value={maquinaria.id_maquinaria}
                      onChange={(e) => {
                        const newDetalleMaquinaria = [...detalleMaquinaria];
                        newDetalleMaquinaria[index].id_maquinaria =
                          e.target.value;
                        setDetalleMaquinaria(newDetalleMaquinaria);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Seleccionar maquinaria</option>
                      {maquinarias.map((maq) => (
                        <option
                          key={maq.id_maquinaria}
                          value={maq.id_maquinaria}
                        >
                          {maq.patente} - {maq.modelo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Operador *
                    </label>
                    <select
                      value={maquinaria.id_empleado}
                      onChange={(e) => {
                        const newDetalleMaquinaria = [...detalleMaquinaria];
                        newDetalleMaquinaria[index].id_empleado =
                          e.target.value;
                        setDetalleMaquinaria(newDetalleMaquinaria);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Seleccionar operador</option>
                      {empleados.map((empleado) => (
                        <option
                          key={empleado.id_empleado}
                          value={empleado.id_empleado}
                        >
                          {empleado.nombre} {empleado.apellido}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <input
                      type="text"
                      value={maquinaria.observaciones}
                      onChange={(e) => {
                        const newDetalleMaquinaria = [...detalleMaquinaria];
                        newDetalleMaquinaria[index].observaciones =
                          e.target.value;
                        setDetalleMaquinaria(newDetalleMaquinaria);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
              onClick={addDetalleProducto}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
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
