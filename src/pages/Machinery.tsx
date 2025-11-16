"use client";

import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardHeader, CardContent } from ".././components/ui/card";
import { Button } from ".././components/ui/button";
import { Badge } from "../components/ui/badge";
// Progress not used on this page
import {
  Search,
  Plus,
  Filter,
  Wrench,
  CheckCircle,
  AlertCircle,
  Plane as Airplane,
  Truck,
} from "lucide-react";
import { ViewToggle } from ".././components/ui/view-toggle";
import CardStats from "../components/CardStats";
import { TableActions } from ".././components/ui/table-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from ".././components/ui/alert-dialog";
import { CreateMachineryModal } from ".././components/CreateMachineryModal";

export function Machinery() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteMachineryId, setDeleteMachineryId] = useState<number | null>(
    null
  );
  const navigate = useNavigate();

  const maquinarias = [
    {
      id: 1,
      patente: "ABC-123",
      nombre: "Tractor John Deere 6120",
      tipo: "suelo",
      marcaModelo: "John Deere / 6120M",
      estado: "en uso",
      ultimoMantenimiento: "2024-09-15",
    },
    {
      id: 2,
      patente: "XYZ-789",
      nombre: "Cosechadora Case IH 8230",
      tipo: "suelo",
      marcaModelo: "Case IH / 8230",
      estado: "mantenimiento",
      ultimoMantenimiento: "2024-10-02",
    },
    {
      id: 3,
      patente: "LMN-456",
      nombre: "Pulverizadora Apache 1240",
      tipo: "suelo",
      marcaModelo: "Apache / 1240",
      estado: "disponible",
      ultimoMantenimiento: "2024-08-10",
    },
    {
      id: 4,
      patente: "JKL-321",
      nombre: "Camión Mercedes Benz Actros",
      tipo: "suelo",
      marcaModelo: "Mercedes Benz / Actros 2645",
      estado: "fuera de servicio",
      ultimoMantenimiento: "2024-03-20",
    },
    {
      id: 5,
      patente: "AV-001",
      nombre: "Aeronave Pulverizadora AgriAir A320",
      tipo: "aire",
      marcaModelo: "AgriAir / A320",
      estado: "disponible",
      ultimoMantenimiento: "2024-09-10",
    },
  ];

  const filteredMachinery = maquinarias.filter(
    (maq) =>
      maq.patente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maq.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maq.marcaModelo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "disponible":
        return (
          <Badge className="bg-green-100 text-green-700">Disponible</Badge>
        );
      case "en uso":
        return <Badge className="bg-blue-100 text-blue-700">En Uso</Badge>;
      case "mantenimiento":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">Mantenimiento</Badge>
        );
      case "fuera de servicio":
        return (
          <Badge className="bg-red-100 text-red-700">Fuera de servicio</Badge>
        );
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getTipoIcon = (tipo?: string) => {
    if (!tipo) return <Truck className="w-6 h-6 text-gray-500" />;
    if (tipo === "aire") return <Airplane className="w-6 h-6 text-gray-500" />;
    // suelo y otros
    return <Truck className="w-6 h-6 text-gray-500" />;
  };

  // const handleCreateMachinery = () => {
  //   navigate("/machinery/new");
  // };

  const handleDeleteMachinery = (id: number) => setDeleteMachineryId(id);

  const confirmDelete = () => {
    if (deleteMachineryId) {
      console.log("Eliminando maquinaria:", deleteMachineryId);
      setDeleteMachineryId(null);
    }
  };

  const handleViewMachinery = (id: number) => {
    window.location.href = `#machinery-detail-${id}`;
  };

  const handleEditMachinery = (id: number) => {
    window.location.href = `#machinery-edit-${id}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Maquinarias</h1>
          <p className="text-gray-600 mt-1">
            Gestiona, supervisa y controla el estado de todas las maquinarias
            disponibles.
          </p>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva maquinaria
        </Button>
      </div>

      {/* Filtros y vista */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar maquinarias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 ${
                searchTerm.trim() === ""
                  ? "border-gray-200"
                  : "border-green-500 focus:ring-green-500"
              }`}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {/* Vista Cards / Tabla */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMachinery.map((maq) => (
            <Card
              key={maq.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getTipoIcon((maq as any).tipo)}
                      <h3 className="text-lg font-semibold text-gray-900 ml-3">
                        {maq.patente}
                      </h3>
                    </div>
                    {getEstadoBadge(maq.estado)}
                  </div>
                  <p className="text-sm font-medium text-green-600 mb-1">
                    {maq.nombre}
                  </p>
                  <p className="text-sm text-gray-500">{maq.marcaModelo}</p>
                </div>
                <TableActions
                  onView={() => handleViewMachinery(maq.id)}
                  onEdit={() => handleEditMachinery(maq.id)}
                  onDelete={() => handleDeleteMachinery(maq.id)}
                  showView
                  showEdit
                  showDelete
                  forceDropdown
                />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Último mantenimiento:</span>
                    <p className="font-medium">
                      {new Date(maq.ultimoMantenimiento).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Estado actual:</span>
                    <p className="font-medium text-gray-700">{maq.estado}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre / Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marca / Modelo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último mantenimiento
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMachinery.map((maq) => (
                  <tr key={maq.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {maq.patente}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 flex items-center">
                      <span className="ml-3">{maq.nombre}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {maq.marcaModelo}
                    </td>
                    <td className="px-6 py-4">{getEstadoBadge(maq.estado)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(maq.ultimoMantenimiento).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <TableActions
                        onView={() => handleViewMachinery(maq.id)}
                        onEdit={() => handleEditMachinery(maq.id)}
                        onDelete={() => handleDeleteMachinery(maq.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Diálogo de confirmación de borrado */}
      <AlertDialog
        open={deleteMachineryId !== null}
        onOpenChange={() => setDeleteMachineryId(null)}
      >
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
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {filteredMachinery.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron maquinarias.
        </div>
      )}
    </div>
  );
}
