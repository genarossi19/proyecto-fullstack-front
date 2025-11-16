import { Plus, Search, Filter } from "lucide-react";
import { Button } from "../components/ui/button";

import { useEffect, useRef, useState } from "react";
import { TableActions } from "../components/ui/table-actions";

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
import type { WorkOrderSummaryResponse } from "../types/WorkOrder";
import { getAllWorkOrders } from "../api/services/WorkOrderService";
import { toast } from "sonner";
import { Skeleton } from "../components/ui/skeleton";
import {
  FilterWorkOrdersDropdown,
  type FilterState,
} from "../components/FilterWorkOrdersDropdown";

export function WorkOrders() {
  const [deleteOrderId, setDeleteOrderId] = useState<number | null>(null);
  const [workOrders, setWorkOrders] = useState<WorkOrderSummaryResponse[]>([]);
  const [filteredWorkOrders, setFilteredWorkOrders] = useState<
    WorkOrderSummaryResponse[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] =
    useState<boolean>(false);
  const filterButtonRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    createdAtFrom: "",
    createdAtTo: "",
    initDateFrom: "",
    initDateTo: "",
  });

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return ""; // por si es null
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // meses 0-11
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const capitalizeFirst = (text: string | null | undefined): string => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Efecto para aplicar búsqueda y filtros
  useEffect(() => {
    applySearchAndFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filters, workOrders]);

  const applySearchAndFilters = () => {
    let result = workOrders;

    // Aplicar búsqueda
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter((order) => {
        const orderNumber = `OT-${order.id
          .toString()
          .padStart(3, "0")}`.toLowerCase();
        const clientName = order.client.name.toLowerCase();
        const fieldName = order.field.name.toLowerCase();
        const serviceName = order.service.name.toLowerCase();

        return (
          orderNumber.includes(lowerSearchTerm) ||
          clientName.includes(lowerSearchTerm) ||
          fieldName.includes(lowerSearchTerm) ||
          serviceName.includes(lowerSearchTerm)
        );
      });
    }

    // Aplicar filtros
    if (filters.status.length > 0) {
      result = result.filter((order) => {
        if (!order.status) return false;
        return filters.status.includes(order.status);
      });
    }

    if (filters.createdAtFrom) {
      const fromDate = new Date(filters.createdAtFrom);
      result = result.filter((order) => {
        if (!order.created_at) return false;
        return new Date(order.created_at) >= fromDate;
      });
    }

    if (filters.createdAtTo) {
      const toDate = new Date(filters.createdAtTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter((order) => {
        if (!order.created_at) return false;
        return new Date(order.created_at) <= toDate;
      });
    }

    if (filters.initDateFrom) {
      const fromDate = new Date(filters.initDateFrom);
      result = result.filter((order) => {
        if (!order.init_date) return false;
        return new Date(order.init_date) >= fromDate;
      });
    }

    if (filters.initDateTo) {
      const toDate = new Date(filters.initDateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter((order) => {
        if (!order.init_date) return false;
        return new Date(order.init_date) <= toDate;
      });
    }

    setFilteredWorkOrders(result);
  };
  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        setLoading(true);
        const response = await getAllWorkOrders();
        setWorkOrders(response);
        setLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        toast.error("Error fetching work orders", {
          description: errorMessage,
        });
        console.error("Error fetching work orders:", error);
      }
    };

    fetchWorkOrders();
  }, []);

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="relative" ref={filterButtonRef}>
            <Button
              variant="outline"
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <FilterWorkOrdersDropdown
              isOpen={isFilterDropdownOpen}
              onClose={() => setIsFilterDropdownOpen(false)}
              onApplyFilters={setFilters}
              currentFilters={filters}
              anchorRef={filterButtonRef}
            />
          </div>
        </div>
      </div>

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
                  Fecha Emision
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Inicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading
                ? Array.from({ length: 5 }).map(
                    (
                      _,
                      idx // 5 filas de ejemplo
                    ) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-4 w-16" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-4 w-20" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-4 w-20" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-4 w-20 rounded-full" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Skeleton className="h-4 w-16" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Skeleton className="h-4 w-24" />
                        </td>
                      </tr>
                    )
                  )
                : filteredWorkOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleWorkOrderClick(order.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        OT-{order.id.toString().padStart(3, "0")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.client.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.service.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.field.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(order.init_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === "Completado"
                              ? "bg-green-100 text-green-700"
                              : order.status === "En Progreso"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {capitalizeFirst(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <TableActions
                          onView={() => handleViewOrder(order.id)}
                          onEdit={() => handleEditOrder(order.id)}
                          onDelete={() => handleDeleteOrder(order.id)}
                        />
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

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
