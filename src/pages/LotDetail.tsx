import { ArrowLeft, Edit, Trash2 } from "lucide-react";
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
import { getLotById, deleteLot } from "../api/services/LotService";
import type { LotResponse } from "../types/LotType";
import { toast } from "sonner";
import { Skeleton } from "../components/ui/skeleton";

export function LotDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lot, setLot] = useState<LotResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const lotId = id ? parseInt(id, 10) : null;

  useEffect(() => {
    const fetchLot = async () => {
      if (!lotId) {
        toast.error("ID de lote inválido");
        navigate(-1);
        return;
      }

      try {
        setLoading(true);
        const data = await getLotById(lotId);
        setLot(data);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        toast.error("Error al cargar el lote", {
          description: errorMessage,
        });
        console.error("Error fetching lot:", error);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchLot();
  }, [lotId, navigate]);

  const onBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    if (lot) {
      toast.info("Función de edición pendiente");
    }
  };

  const handleDelete = async () => {
    if (!lotId) return;

    try {
      await deleteLot(lotId);
      toast.success("Lote eliminado correctamente");
      navigate(-1);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error("Error al eliminar el lote", {
        description: errorMessage,
      });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-48" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <p className="text-center text-gray-600 mt-4">No se encontró el lote</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">{lot.name}</h1>
            <p className="text-gray-600 mt-1">
              {lot.field?.client?.name} • {lot.field?.name}
            </p>
          </div>
        </div>
      </div>

      {/* General Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Nombre
              </label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {lot.name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Campo</label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {lot.field?.name || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Cliente
              </label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {lot.field?.client?.name || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Superficie (ha)
              </label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {lot.area}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Latitud
              </label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {lot.lat?.toFixed(4) || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Longitud
              </label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {lot.long?.toFixed(4) || "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={handleEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Button>
        <Button
          variant="outline"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Eliminar
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El lote será eliminado
              permanentemente.
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
