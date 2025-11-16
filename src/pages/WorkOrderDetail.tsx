import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useState, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router";
import { Skeleton } from "../components/ui/skeleton";
import {
  getWorkOrder,
  deleteWorkOrder,
} from "../api/services/WorkOrderService";
import type { WorkOrderDetailResponse } from "../types/WorkOrder";
import { toast } from "sonner";

export function WorkOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workOrder, setWorkOrder] = useState<WorkOrderDetailResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchWorkOrder = async () => {
      if (!id) {
        toast.error("ID de orden de trabajo no proporcionado");
        navigate(-1);
        return;
      }

      try {
        setLoading(true);
        const workOrderId = parseInt(id, 10);
        const data = await getWorkOrder(workOrderId);
        setWorkOrder(data);
      } catch {
        toast.error("Error al cargar la orden de trabajo");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrder();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;

    try {
      setIsDeleting(true);
      const workOrderId = parseInt(id, 10);
      await deleteWorkOrder(workOrderId);
      toast.success("Orden de trabajo eliminada exitosamente");
      navigate(-1);
    } catch {
      toast.error("Error al eliminar la orden de trabajo");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const getStatusColor = (status: string | null | undefined) => {
    switch (status?.toLowerCase()) {
      case "completado":
        return "bg-green-100 text-green-700";
      case "en progreso":
        return "bg-blue-100 text-blue-700";
      case "cancelado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" disabled>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <Skeleton className="h-9 w-60" />
              <Skeleton className="h-5 w-40 mt-2" />
            </div>
          </div>
          <Skeleton className="h-8 w-32" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(null)
                .map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-32 mt-2" />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalle de Lotes</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <Card className="mt-4">
          <CardContent className="p-6">
            <p className="text-gray-600">Orden de trabajo no encontrada</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {workOrder.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Detalles completos de la orden de trabajo
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
              workOrder.status
            )}`}
          >
            {workOrder.status}
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
            {workOrder.client && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Cliente
                </label>
                <p className="mt-1 text-base font-medium text-gray-900">
                  {workOrder.client.name}
                </p>
              </div>
            )}
            {workOrder.field && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Campo
                </label>
                <p className="mt-1 text-base font-medium text-gray-900">
                  {workOrder.field.name}
                </p>
              </div>
            )}
            {workOrder.service && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Servicio
                </label>
                <p className="mt-1 text-base font-medium text-gray-900">
                  {workOrder.service.name}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">
                Fecha Inicio
              </label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {workOrder.init_date
                  ? new Date(workOrder.init_date).toLocaleDateString("es-AR")
                  : "No definida"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Fecha Fin
              </label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {workOrder.finish_date
                  ? new Date(workOrder.finish_date).toLocaleDateString("es-AR")
                  : "No definida"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Precio
              </label>
              <p className="mt-1 text-base font-medium text-green-600">
                $
                {typeof workOrder.price === "string"
                  ? parseFloat(workOrder.price).toFixed(2)
                  : workOrder.price?.toFixed(2) || "0.00"}
              </p>
            </div>
            {workOrder.observation && (
              <div className="md:col-span-2 lg:col-span-3">
                <label className="text-sm font-medium text-gray-500">
                  Observaciones
                </label>
                <p className="mt-1 text-base text-gray-900">
                  {workOrder.observation}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lot Details */}
      {workOrder.lotDetails && workOrder.lotDetails.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detalle de Lotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workOrder.lotDetails.map((lotDetail, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h4 className="font-medium text-gray-900 mb-3">
                    Lote {index + 1}: {lotDetail.lot?.name || "Sin nombre"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Área
                      </label>
                      <p className="mt-1 text-base text-gray-900">
                        {lotDetail.lot?.area || "N/A"} ha
                      </p>
                    </div>
                    {lotDetail.lot?.lat && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Latitud
                        </label>
                        <p className="mt-1 text-base text-gray-900">
                          {lotDetail.lot.lat}
                        </p>
                      </div>
                    )}
                    {lotDetail.lot?.long && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Longitud
                        </label>
                        <p className="mt-1 text-base text-gray-900">
                          {lotDetail.lot.long}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Machinery Details */}
      {workOrder.machineryDetails && workOrder.machineryDetails.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Maquinaria Asignada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workOrder.machineryDetails.map((machDetail, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {machDetail.machinery && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Nombre
                          </label>
                          <p className="mt-1 text-base text-gray-900">
                            {machDetail.machinery.name}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Tipo
                          </label>
                          <p className="mt-1 text-base text-gray-900">
                            {machDetail.machinery.type}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Marca
                          </label>
                          <p className="mt-1 text-base text-gray-900">
                            {machDetail.machinery.brand || "N/A"}
                          </p>
                        </div>
                        {machDetail.machinery.model && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Modelo
                            </label>
                            <p className="mt-1 text-base text-gray-900">
                              {machDetail.machinery.model}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card className="bg-gray-50 border-2 border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Elimina esta orden de trabajo.
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
                className="flex-1 sm:flex-none text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
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
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
