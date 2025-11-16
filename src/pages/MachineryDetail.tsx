import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
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
import { getMachineryById } from "../api/services/MachineryService";
import type { MachineryType } from "../types/Machinery";
import { toast } from "sonner";
import { Skeleton } from "../components/ui/skeleton";

export function MachineryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [machinery, setMachinery] = useState<MachineryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const machineryId = id ? parseInt(id, 10) : null;

  useEffect(() => {
    const fetchMachinery = async () => {
      if (!machineryId) {
        toast.error("ID de maquinaria inválido");
        navigate(-1);
        return;
      }

      try {
        setLoading(true);
        const data = await getMachineryById(machineryId);
        setMachinery(data);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        toast.error("Error al cargar la maquinaria", {
          description: errorMessage,
        });
        console.error("Error fetching machinery:", error);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchMachinery();
  }, [machineryId, navigate]);

  const onBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    if (machinery) {
      navigate(`/machinery/${machinery.id}/edit`);
    }
  };

  const handleDelete = () => {
    console.log("Deleting machinery:", machineryId);
    setShowDeleteDialog(false);
    onBack();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Disponible":
        return (
          <Badge className="bg-green-100 text-green-700">Disponible</Badge>
        );
      case "En Uso":
        return <Badge className="bg-blue-100 text-blue-700">En Uso</Badge>;
      case "Mantenimiento":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">Mantenimiento</Badge>
        );
      case "Fuera de Servicio":
        return (
          <Badge className="bg-red-100 text-red-700">Fuera de Servicio</Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
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

  if (!machinery) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <p className="text-center text-gray-600 mt-4">
          No se encontró la maquinaria
        </p>
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
            <h1 className="text-3xl font-semibold text-gray-900">
              {machinery.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Detalles completos de la maquinaria
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
                {machinery.name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Tipo</label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {machinery.type}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Marca</label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {machinery.brand}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Modelo
              </label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {machinery.model}
              </p>
            </div>
            {machinery.patent && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Matrícula
                </label>
                <p className="mt-1 text-base font-medium text-gray-900">
                  {machinery.patent}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">
                Estado
              </label>
              <div className="mt-1">{getStatusBadge(machinery.status)}</div>
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
              Esta acción no se puede deshacer. La maquinaria será eliminada
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
