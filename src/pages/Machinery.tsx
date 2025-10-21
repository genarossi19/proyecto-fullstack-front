import { Plus, Search, Filter, Truck, Wrench, Calendar } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { useState } from "react";
import { CreateMachineryModal } from "../components/CreateMachineryModal";
import { TableActions } from "../components/ui/table-actions";
import { ViewToggle } from "../components/ui/view-toggle";
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

export function Machinery() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteMachineryId, setDeleteMachineryId] = useState<string | null>(
    null
  );

  const machinery = [
    {
      id: "MAC-001",
      name: "Tractor John Deere 6120M",
      type: "Tractor",
      status: "Disponible",
      location: "Galpón A",
      lastMaintenance: "2024-01-05",
      nextMaintenance: "2024-02-05",
      hoursWorked: 1250,
    },
    {
      id: "MAC-002",
      name: "Cosechadora Case IH 8240",
      type: "Cosechadora",
      status: "En Uso",
      location: "Lote B",
      lastMaintenance: "2023-12-20",
      nextMaintenance: "2024-01-20",
      hoursWorked: 890,
    },
    {
      id: "MAC-003",
      name: "Pulverizadora Apache 1020",
      type: "Pulverizadora",
      status: "Mantenimiento",
      location: "Taller",
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-02-10",
      hoursWorked: 650,
    },
  ];

  const handleViewMachinery = (id: string) => {
    console.log("Viewing machinery:", id);
  };

  const handleEditMachinery = (id: string) => {
    console.log("Editing machinery:", id);
  };

  const handleDeleteMachinery = (id: string) => {
    setDeleteMachineryId(id);
  };

  const confirmDelete = () => {
    if (deleteMachineryId) {
      console.log("Deleting machinery:", deleteMachineryId);
      setDeleteMachineryId(null);
    }
  };

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Gestión de Maquinarias
            </h1>
            <p className="text-gray-600 mt-1">
              Controla el estado y mantenimiento de toda tu maquinaria agrícola.
            </p>
          </div>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Maquinaria
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Truck className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">15</p>
                  <p className="text-gray-600">Total Maquinarias</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-gray-600">Disponibles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">2</p>
                  <p className="text-gray-600">En Uso</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Wrench className="w-8 h-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">1</p>
                  <p className="text-gray-600">En Mantenimiento</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar maquinaria..."
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>

        {viewMode === "cards" ? (
          /* Machinery List */
          <div className="space-y-4">
            {machinery.map((machine) => (
              <Card key={machine.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Truck className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {machine.name}
                        </h3>
                        <p className="text-gray-600">
                          {machine.id} • {machine.type}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-8">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-center cursor-help">
                            <span
                              className={`px-3 py-1 text-sm rounded-full font-medium ${
                                machine.status === "Disponible"
                                  ? "bg-green-100 text-green-600"
                                  : machine.status === "En Uso"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {machine.status}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Estado actual de la maquinaria</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-center cursor-help">
                            <p className="font-medium text-gray-900">
                              {machine.location}
                            </p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ubicación actual</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-center cursor-help">
                            <p className="font-medium text-gray-900">
                              {machine.hoursWorked}h
                            </p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Horas trabajadas totales</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-center cursor-help">
                            <div className="flex items-center text-sm font-medium text-gray-900">
                              <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                              {machine.nextMaintenance}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Próximo mantenimiento programado</p>
                        </TooltipContent>
                      </Tooltip>

                      <TableActions
                        onView={() => handleViewMachinery(machine.id)}
                        onEdit={() => handleEditMachinery(machine.id)}
                        onDelete={() => handleDeleteMachinery(machine.id)}
                        viewLabel="Ver Detalles"
                        forceDropdown={true}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Added table view */
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900">
                        Maquinaria
                      </th>
                      <th className="text-left p-4 font-medium text-gray-900">
                        Tipo
                      </th>
                      <th className="text-left p-4 font-medium text-gray-900">
                        Estado
                      </th>
                      <th className="text-left p-4 font-medium text-gray-900">
                        Ubicación
                      </th>
                      <th className="text-left p-4 font-medium text-gray-900">
                        Horas Trabajadas
                      </th>
                      <th className="text-left p-4 font-medium text-gray-900">
                        Último Mantenimiento
                      </th>
                      <th className="text-left p-4 font-medium text-gray-900">
                        Próximo Mantenimiento
                      </th>
                      <th className="text-left p-4 font-medium text-gray-900">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {machinery.map((machine) => (
                      <tr
                        key={machine.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <Truck className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {machine.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {machine.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-900">
                          {machine.type}
                        </td>
                        <td className="p-4">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                className={`px-2 py-1 text-xs rounded-full font-medium cursor-help ${
                                  machine.status === "Disponible"
                                    ? "bg-green-100 text-green-600"
                                    : machine.status === "En Uso"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {machine.status}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Estado actual de la maquinaria</p>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="p-4">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-sm text-gray-900 cursor-help">
                                {machine.location}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ubicación actual</p>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="p-4">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-sm font-medium text-gray-900 cursor-help">
                                {machine.hoursWorked}h
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Horas trabajadas totales</p>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="p-4 text-sm text-gray-900">
                          {machine.lastMaintenance}
                        </td>
                        <td className="p-4">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center text-sm font-medium text-gray-900 cursor-help">
                                <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                                {machine.nextMaintenance}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Próximo mantenimiento programado</p>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                        <td className="p-4">
                          <TableActions
                            onView={() => handleViewMachinery(machine.id)}
                            onEdit={() => handleEditMachinery(machine.id)}
                            onDelete={() => handleDeleteMachinery(machine.id)}
                            viewLabel="Ver Detalles"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create Machinery Modal */}
        <CreateMachineryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />

        {/* Delete Confirmation Dialog */}
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
      </div>
    </TooltipProvider>
  );
}
