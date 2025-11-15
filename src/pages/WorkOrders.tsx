import { Plus, Search, Filter } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { useState } from "react";
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
import { useNavigate } from "react-router";

export function WorkOrders() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");
  const [deleteOrderId, setDeleteOrderId] = useState<number | null>(null);

  const workOrders = [
    {
      id_orden_de_trabajo: 1,
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
      superficie_ha: 45.5,
    },
    {
      id_orden_de_trabajo: 2,
      id_cliente: 2,
      id_campo: 2,
      id_presupuesto: 2,
      id_servicio: 2,
      fecha_emision: "2024-01-11",
      fecha_inicio: "2024-01-18",
      fecha_fin: "2024-01-20",
      campaña: "2024/25",
      estado: "Pendiente",
      observaciones: "Aplicación de herbicida pre-emergente",
      cliente_nombre: "Agropecuaria Norte",
      campo_nombre: "Lote B",
      servicio_nombre: "Fumigación de Soja",
      superficie_ha: 32.0,
    },
    {
      id_orden_de_trabajo: 3,
      id_cliente: 3,
      id_campo: 3,
      id_presupuesto: 3,
      id_servicio: 3,
      fecha_emision: "2024-01-05",
      fecha_inicio: "2024-01-08",
      fecha_fin: "2024-01-10",
      campaña: "2024/25",
      estado: "Completado",
      observaciones: "Siembra directa con fertilización",
      cliente_nombre: "Campo Verde",
      campo_nombre: "Lote C",
      servicio_nombre: "Siembra de Trigo",
      superficie_ha: 28.3,
    },
  ];

  const navigate = useNavigate();

  const handleDeleteOrder = (id: number) => {
    setDeleteOrderId(id);
  };

  const confirmDelete = () => {
    if (deleteOrderId) {
      console.log("Deleting order:", deleteOrderId);
      setDeleteOrderId(null);
    }
  };

  const handleWorkOrderClick = (id: number) => {
    navigate(`/work-orders/${id}`);
  };

  const handleViewOrder = (id: number) => {
    navigate(`/work-orders/${id}`);
  };

  const handleCreateOrder = () => {
    navigate("/work-orders/new");
  };

  const handleEditOrder = (id: number) => {
    navigate(`/work-orders/${id}/edit`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Órdenes de Trabajo
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona y supervisa todas las órdenes de trabajo agrícolas.
          </p>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={handleCreateOrder}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Orden
        </Button>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar órdenes..."
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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {workOrders.map((order) => (
            <Card
              key={order.id_orden_de_trabajo}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleWorkOrderClick(order.id_orden_de_trabajo)}
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {order.cliente_nombre}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.estado === "Completado"
                          ? "bg-green-100 text-green-700"
                          : order.estado === "En Progreso"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.estado}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-green-600 mb-1">
                    {order.servicio_nombre}
                  </p>
                  <p className="text-sm text-gray-500">
                    OT-{order.id_orden_de_trabajo.toString().padStart(3, "0")} |{" "}
                    {order.fecha_inicio}
                  </p>
                </div>
                <TableActions
                  onView={(e) => {
                    e.stopPropagation();
                    handleViewOrder(order.id_orden_de_trabajo);
                  }}
                  onEdit={(e) => {
                    e.stopPropagation();
                    handleEditOrder(order.id_orden_de_trabajo);
                  }}
                  onDelete={(e) => {
                    e.stopPropagation();
                    handleDeleteOrder(order.id_orden_de_trabajo);
                  }}
                  showView
                  showEdit
                  showDelete
                  forceDropdown
                />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Campo:</span>
                    <p className="font-medium">{order.campo_nombre}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Superficie:</span>
                    <p className="font-medium">{order.superficie_ha} ha</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Campaña:</span>
                    <p className="font-medium">{order.campaña}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Emisión:</span>
                    <p className="font-medium">{order.fecha_emision}</p>
                  </div>
                </div>

                {order.observaciones && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                    {order.observaciones}
                  </div>
                )}
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
                    Orden
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Inicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Superficie
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workOrders.map((order) => (
                  <tr
                    key={order.id_orden_de_trabajo}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      handleWorkOrderClick(order.id_orden_de_trabajo)
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      OT-{order.id_orden_de_trabajo.toString().padStart(3, "0")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.cliente_nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.servicio_nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.campo_nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.fecha_inicio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.estado === "Completado"
                            ? "bg-green-100 text-green-700"
                            : order.estado === "En Progreso"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.superficie_ha} ha
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <TableActions
                        onView={(e) => {
                          e.stopPropagation();
                          handleViewOrder(order.id_orden_de_trabajo);
                        }}
                        onEdit={(e) => {
                          e.stopPropagation();
                          handleEditOrder(order.id_orden_de_trabajo);
                        }}
                        onDelete={(e) => {
                          e.stopPropagation();
                          handleDeleteOrder(order.id_orden_de_trabajo);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteOrderId !== null}
        onOpenChange={() => setDeleteOrderId(null)}
      >
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
              onClick={confirmDelete}
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
