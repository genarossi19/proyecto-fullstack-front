import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { useNavigate } from "react-router";

interface WorkOrderDetailProps {
  workOrderId: number;
}

export function WorkOrderDetail({ workOrderId }: WorkOrderDetailProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();
  // Mock data - replace with actual data fetching
  const workOrder = {
    id_orden_de_trabajo: workOrderId,
    id_cliente: 1,
    id_campo: 1,
    id_presupuesto: 1,
    id_servicio: 1,
    fecha_emision: "2024-01-10",
    fecha_inicio: "2024-01-12",
    fecha_fin: "2024-01-15",
    campaña: "2024/25",
    estado: "En Progreso",
    observaciones: "Cosecha de maíz en lote principal",
    cliente_nombre: "Finca San José",
    campo_nombre: "Campo Norte",
    servicio_nombre: "Cosecha de Maíz",
    presupuesto_numero: "PRES-001",
    detalleLotes: [
      {
        lote_nombre: "Lote A1",
        cultivo: "Maíz",
        estadio: "R6",
        superficie_ha: 45.5,
        latitud: "-34.5678",
        longitud: "-58.1234",
      },
    ],
    detalleMaquinaria: [
      {
        maquinaria: "ABC123 - John Deere 9600",
        operador: "Juan Pérez",
        observaciones: "Turno mañana",
      },
    ],
    detalleProducto: [
      {
        producto: "Glifosato 48%",
        dosis: "2.5 L/ha",
      },
    ],
  };

  const onBack = () => {
    navigate(-1);
  };

  const handleDelete = () => {
    console.log("[v0] Deleting work order:", workOrderId);
    setShowDeleteDialog(false);
    onBack();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Orden de Trabajo OT-
              {workOrder.id_orden_de_trabajo.toString().padStart(3, "0")}
            </h1>
            <p className="text-gray-600 mt-1">
              Detalles completos de la orden de trabajo
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              workOrder.estado === "Completado"
                ? "bg-green-100 text-green-700"
                : workOrder.estado === "En Progreso"
                ? "bg-blue-100 text-blue-700"
                : workOrder.estado === "Cancelado"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {workOrder.estado}
          </span>
        </div>
      </div>

      {/* General Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Cliente
              </label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {workOrder.cliente_nombre}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Campo</label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {workOrder.campo_nombre}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Servicio
              </label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {workOrder.servicio_nombre}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Presupuesto Relacionado
              </label>
              <p className="mt-1 text-base font-medium text-green-600">
                {workOrder.presupuesto_numero}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Fecha Emisión
              </label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {new Date(workOrder.fecha_emision).toLocaleDateString("es-AR")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Fecha Inicio
              </label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {new Date(workOrder.fecha_inicio).toLocaleDateString("es-AR")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Fecha Fin
              </label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {workOrder.fecha_fin
                  ? new Date(workOrder.fecha_fin).toLocaleDateString("es-AR")
                  : "No definida"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Campaña
              </label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {workOrder.campaña}
              </p>
            </div>
            {workOrder.observaciones && (
              <div className="md:col-span-2 lg:col-span-3">
                <label className="text-sm font-medium text-gray-500">
                  Observaciones
                </label>
                <p className="mt-1 text-base text-gray-900">
                  {workOrder.observaciones}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lot Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Lotes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workOrder.detalleLotes.map((lote, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h4 className="font-medium text-gray-900 mb-3">
                  Lote {index + 1}: {lote.lote_nombre}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Cultivo
                    </label>
                    <p className="mt-1 text-base text-gray-900">
                      {lote.cultivo}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Estadio
                    </label>
                    <p className="mt-1 text-base text-gray-900">
                      {lote.estadio}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Superficie
                    </label>
                    <p className="mt-1 text-base text-gray-900">
                      {lote.superficie_ha} ha
                    </p>
                  </div>
                  {lote.latitud && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Latitud
                      </label>
                      <p className="mt-1 text-base text-gray-900">
                        {lote.latitud}
                      </p>
                    </div>
                  )}
                  {lote.longitud && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Longitud
                      </label>
                      <p className="mt-1 text-base text-gray-900">
                        {lote.longitud}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Machinery Details */}
      <Card>
        <CardHeader>
          <CardTitle>Maquinaria Asignada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workOrder.detalleMaquinaria.map((maq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Maquinaria
                    </label>
                    <p className="mt-1 text-base text-gray-900">
                      {maq.maquinaria}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Operador
                    </label>
                    <p className="mt-1 text-base text-gray-900">
                      {maq.operador}
                    </p>
                  </div>
                  {maq.observaciones && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Observaciones
                      </label>
                      <p className="mt-1 text-base text-gray-900">
                        {maq.observaciones}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product Details */}
      <Card>
        <CardHeader>
          <CardTitle>Productos Aplicados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workOrder.detalleProducto.map((prod, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Producto
                    </label>
                    <p className="mt-1 text-base text-gray-900">
                      {prod.producto}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Dosis
                    </label>
                    <p className="mt-1 text-base text-gray-900">{prod.dosis}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="bg-gray-50 border-2 border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Edita o elimina esta orden de trabajo.
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="flex-1 sm:flex-none text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
              <Button
                onClick={() => onEdit(workOrderId)}
                className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Orden
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La orden de trabajo será
              eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
