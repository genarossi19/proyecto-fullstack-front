import { Plus, Search, Filter, TreePine, LayoutGrid } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CreateClientModal } from "../components/CreateClientModal";
import { EditClientModal } from "../components/EditClientModal";
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

import { CreateFieldModal } from "../components/CreateFieldModal";
import { EditFieldModal } from "../components/EditFieldModal";
import { CreateLotModal } from "../components/CreateLotModal";
import { EditLotModal } from "../components/EditLotModal";
import type { ClientType } from "../types/ClientType";
import {
  getAllClients,
  getClientbyId,
  deleteClient,
} from "../api/services/ClientService";
import { getFieldById, deleteField } from "../api/services/FieldService";
import { deleteLot } from "../api/services/LotService";
import { toast } from "sonner";
import { Skeleton } from "../components/ui/skeleton";

export function Clients() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteClientId, setDeleteClientId] = useState<number | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [editingClient, setEditingClient] = useState<ClientType | null>(null);
  const [clients, setClients] = useState<ClientType[]>([]);
  const [isDeletingClient, setIsDeletingClient] = useState(false);

  useEffect(() => {
    const fetClients = async () => {
      try {
        const response = await getAllClients();
        setClients(response);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetClients();
  }, []);

  const handleClientCreated = async () => {
    try {
      const response = await getAllClients();
      setClients(response);
    } catch (error) {
      console.error("Error reloading clients:", error);
    }
  };

  const handleViewClient = (id: number) => {
    setSelectedClientId(id);
  };

  const handleEditClient = (client: ClientType) => {
    setEditingClient(client);
    setIsEditModalOpen(true);
  };

  const handleDeleteClient = (id: number) => {
    setDeleteClientId(id);
  };

  const confirmDelete = async () => {
    if (!deleteClientId) return;

    try {
      setIsDeletingClient(true);
      await deleteClient(deleteClientId);
      toast.success("Cliente eliminado exitosamente");

      // Recargar lista de clientes
      const response = await getAllClients();
      setClients(response);

      setDeleteClientId(null);
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Error al eliminar el cliente");
    } finally {
      setIsDeletingClient(false);
    }
  };

  const handleClientUpdated = async () => {
    try {
      const response = await getAllClients();
      setClients(response);
    } catch (error) {
      console.error("Error reloading clients:", error);
    }
  };

  const handleBackToClients = () => {
    setSelectedClientId(null);
  };

  if (selectedClientId) {
    return (
      <ClientFieldsView
        clientId={selectedClientId}
        onBack={handleBackToClients}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Gestión de Clientes
          </h1>
          <p className="text-gray-600 mt-1">
            Administra tu cartera de clientes y sus órdenes de trabajo.
          </p>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Razón Social
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    CUIT
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Teléfono
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Email
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Dirección
                  </th>

                  <th className="text-left p-4 font-medium text-gray-900">
                    Estado
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewClient(client.id)}
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {client.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          CLI-{client.id.toString().padStart(3, "0")}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-900">{client.cuit}</td>
                    <td className="p-4 text-sm text-gray-900">
                      {client.phone}
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {client.email}
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {client.address}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          client.active
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {client.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center space-x-2">
                        <TableActions
                          onView={() => handleViewClient(client.id)}
                          onEdit={() => handleEditClient(client)}
                          onDelete={() => handleDeleteClient(client.id)}
                        />
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          Orden
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <CreateClientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onClientCreated={handleClientCreated}
      />

      <EditClientModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingClient(null);
        }}
        onClientUpdated={handleClientUpdated}
        client={editingClient}
      />

      <AlertDialog
        open={deleteClientId !== null}
        onOpenChange={() => setDeleteClientId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El cliente será eliminado
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingClient}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeletingClient}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingClient ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ClientFieldsView({
  clientId,
  onBack,
}: {
  clientId: number;
  onBack: () => void;
}) {
  const [isCreateFieldModalOpen, setIsCreateFieldModalOpen] = useState(false);
  const [deleteFieldId, setDeleteFieldId] = useState<number | null>(null);
  const [isDeletingField, setIsDeletingField] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null);
  const [selectedField, setSelectedField] = useState<any>(null);
  const [editField, setEditField] = useState<any>(null);
  const [isEditFieldModalOpen, setIsEditFieldModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [isDeleteClientDialogOpen, setIsDeleteClientDialogOpen] =
    useState(false);
  const [isDeletingClient, setIsDeletingClient] = useState(false);
  const [client, setClient] = useState<ClientType | null>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const clientData = await getClientbyId(clientId);
        setClient(clientData);
        // Asumiendo que la respuesta tiene un array de fields
        setFields(clientData.fields || []);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        toast.error("Error al cargar los datos del cliente", {
          description: errorMessage,
        });
        console.error("Error fetching client data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  const handleViewField = (fieldId: number) => {
    const field = fields.find((f: any) => f.id === fieldId);
    setSelectedFieldId(fieldId);
    setSelectedField(field);
  };

  const handleEditField = (fieldId: number) => {
    const field = fields.find((f: any) => f.id === fieldId);
    if (field) {
      setEditField(field);
      setIsEditFieldModalOpen(true);
    }
  };

  const handleDeleteField = (fieldId: number) => {
    setDeleteFieldId(fieldId);
  };

  const confirmDeleteField = async () => {
    if (!deleteFieldId) return;

    try {
      setIsDeletingField(true);
      await deleteField(deleteFieldId);
      toast.success("Campo eliminado exitosamente");

      // Recargar datos del cliente
      const clientData = await getClientbyId(clientId);
      setClient(clientData);
      setFields(clientData.fields || []);

      setDeleteFieldId(null);
    } catch (error) {
      console.error("Error deleting field:", error);
      toast.error("Error al eliminar el campo");
    } finally {
      setIsDeletingField(false);
    }
  };

  const handleFieldCreated = async () => {
    try {
      const clientData = await getClientbyId(clientId);
      setClient(clientData);
      setFields(clientData.fields || []);
      toast.success("Campo creado exitosamente");
    } catch (error) {
      console.error("Error reloading fields:", error);
    }
  };

  const handleFieldUpdated = async () => {
    try {
      const clientData = await getClientbyId(clientId);
      setClient(clientData);
      setFields(clientData.fields || []);
      toast.success("Campo actualizado exitosamente");
    } catch (error) {
      console.error("Error reloading fields:", error);
    }
  };

  const handleBackToFields = () => {
    setSelectedFieldId(null);
    setSelectedField(null);
  };

  const handleEditClient = () => {
    setIsEditClientModalOpen(true);
  };

  const handleDeleteClient = () => {
    setIsDeleteClientDialogOpen(true);
  };

  const confirmDeleteClient = async () => {
    try {
      setIsDeletingClient(true);
      await deleteClient(clientId);
      toast.success("Cliente eliminado exitosamente");
      onBack();
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Error al eliminar el cliente");
    } finally {
      setIsDeletingClient(false);
      setIsDeleteClientDialogOpen(false);
    }
  };

  const handleClientUpdated = async () => {
    try {
      const clientData = await getClientbyId(clientId);
      setClient(clientData);
      setFields(clientData.fields || []);
      toast.success("Cliente actualizado exitosamente");
    } catch (error) {
      console.error("Error reloading client:", error);
      toast.error("Error al actualizar los datos del cliente");
    }
  };

  // Show field lots view when a field is selected
  if (selectedFieldId && selectedField) {
    return (
      <FieldLotsView
        fieldId={selectedFieldId}
        fieldData={selectedField}
        clientName={client?.name || "Cliente"}
        onBack={handleBackToFields}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            ← Volver a Clientes
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Campos de {client?.name || "Cliente"}
            </h1>
            <p className="text-gray-600 mt-1">
              Administra los campos y lotes de este cliente.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleEditClient}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Editar Cliente
          </Button>
          <Button
            variant="outline"
            onClick={handleDeleteClient}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            Eliminar Cliente
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setIsCreateFieldModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Campo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              {loading ? (
                <>
                  <Skeleton className="w-8 h-8 rounded" />
                  <div className="ml-4 flex-1">
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </>
              ) : (
                <>
                  <TreePine className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {fields?.length || 0}
                    </p>
                    <p className="text-gray-600">Total Campos</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              {loading ? (
                <>
                  <Skeleton className="w-8 h-8 rounded" />
                  <div className="ml-4 flex-1">
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </>
              ) : (
                <>
                  <LayoutGrid className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {fields?.reduce(
                        (sum: number, field: any) => sum + (field.lots || 0),
                        0
                      ) || 0}
                    </p>
                    <p className="text-gray-600">Total Lotes</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              {loading ? (
                <>
                  <Skeleton className="w-8 h-8 rounded" />
                  <div className="ml-4 flex-1">
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {fields
                        ?.reduce(
                          (sum: number, field: any) => sum + (field.area || 0),
                          0
                        )
                        .toFixed(1) || 0}
                    </p>
                    <p className="text-gray-600">Hectáreas Totales</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar campos..."
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Nombre
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Superficie (ha)
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Cultivo Actual
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Lotes
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Coordenadas
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 4 }).map((_, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-4">
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-3 w-16" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-16" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-16" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-8" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-32" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-20" />
                        </td>
                      </tr>
                    ))
                  : fields?.map((field: any) => (
                      <tr
                        key={field.id}
                        className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleViewField(field.id)}
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {field.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              CAM-{field.id.toString().padStart(3, "0")}
                            </p>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-900">
                          {field.area} ha
                        </td>
                        <td className="p-4 text-sm text-green-600">
                          {field.active ? "Activo" : "Inactivo"}
                        </td>
                        <td className="p-4 text-sm text-blue-600">
                          {field.lots}
                        </td>
                        <td className="p-4 text-sm text-gray-900">
                          {field.lat?.toFixed(4)}, {field.long?.toFixed(4)}
                        </td>
                        <td className="p-4">
                          <TableActions
                            onView={() => handleViewField(field.id)}
                            onEdit={() => handleEditField(field.id)}
                            onDelete={() => handleDeleteField(field.id)}
                            viewLabel="Ver Lotes"
                          />
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <CreateFieldModal
        isOpen={isCreateFieldModalOpen}
        onClose={() => setIsCreateFieldModalOpen(false)}
        clientId={clientId}
        clientName={client?.name || "Cliente"}
        onFieldCreated={handleFieldCreated}
      />

      {editField && (
        <EditFieldModal
          isOpen={isEditFieldModalOpen}
          onClose={() => {
            setIsEditFieldModalOpen(false);
            setEditField(null);
          }}
          field={editField}
          clientName={client?.name || "Cliente"}
          onFieldUpdated={handleFieldUpdated}
        />
      )}

      <AlertDialog
        open={deleteFieldId !== null}
        onOpenChange={() => setDeleteFieldId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El campo y todos sus lotes serán
              eliminados permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingField}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteField}
              disabled={isDeletingField}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingField ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {client && (
        <EditClientModal
          isOpen={isEditClientModalOpen}
          onClose={() => setIsEditClientModalOpen(false)}
          client={client}
          onClientUpdated={handleClientUpdated}
        />
      )}

      <AlertDialog
        open={isDeleteClientDialogOpen}
        onOpenChange={setIsDeleteClientDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El cliente y todos sus campos y
              lotes serán eliminados permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingClient}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteClient}
              disabled={isDeletingClient}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingClient ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function FieldLotsView({
  fieldId,
  fieldData,
  clientName,
  onBack,
}: {
  fieldId: number;
  fieldData: any;
  clientName: string;
  onBack: () => void;
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");
  const [lots, setLots] = useState<any[]>([]);
  const [isCreateLotModalOpen, setIsCreateLotModalOpen] = useState(false);
  const [deleteLotId, setDeleteLotId] = useState<number | null>(null);
  const [isDeletingLot, setIsDeletingLot] = useState(false);
  const [editLot, setEditLot] = useState<any>(null);
  const [isEditLotModalOpen, setIsEditLotModalOpen] = useState(false);

  const field = {
    id_campo: fieldData?.id || fieldId,
    nombre: fieldData?.name || "Campo",
    superficie_ha: fieldData?.area || 0,
  };

  useEffect(() => {
    const fetchLots = async () => {
      try {
        setLoading(true);
        const fieldWithLots = await getFieldById(fieldId);
        setLots(fieldWithLots?.lots || []);
      } catch (error) {
        console.error("Error fetching lots:", error);
        toast.error("Error al cargar los lotes del campo");
        setLots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLots();
  }, [fieldId]);

  const handleEditLot = (lotId: number) => {
    const lot = lots.find((l: any) => l.id === lotId);
    if (lot) {
      setEditLot(lot);
      setIsEditLotModalOpen(true);
    }
  };

  const handleViewLot = (lotId: number) => {
    navigate(`/lots/${lotId}`);
  };

  const handleDeleteLot = (lotId: number) => {
    setDeleteLotId(lotId);
  };

  const confirmDeleteLot = async () => {
    if (!deleteLotId) return;

    try {
      setIsDeletingLot(true);
      await deleteLot(deleteLotId);
      toast.success("Lote eliminado exitosamente");

      // Recargar lotes del campo
      const fieldWithLots = await getFieldById(fieldId);
      setLots(fieldWithLots?.lots || []);

      setDeleteLotId(null);
    } catch (error) {
      console.error("Error deleting lot:", error);
      toast.error("Error al eliminar el lote");
    } finally {
      setIsDeletingLot(false);
    }
  };

  const handleLotCreated = async () => {
    try {
      const fieldWithLots = await getFieldById(fieldId);
      setLots(fieldWithLots?.lots || []);
      toast.success("Lote creado exitosamente");
    } catch (error) {
      console.error("Error reloading lots:", error);
    }
  };

  const handleLotUpdated = async () => {
    try {
      const fieldWithLots = await getFieldById(fieldId);
      setLots(fieldWithLots?.lots || []);
      toast.success("Lote actualizado exitosamente");
    } catch (error) {
      console.error("Error reloading lots:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            ← Volver a Campos
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Lotes de {field.nombre}
            </h1>
            <p className="text-gray-600 mt-1">
              {clientName} • {field.superficie_ha} ha
            </p>
          </div>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setIsCreateLotModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Lote
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <div className="flex items-center">
                <LayoutGrid className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {lots.length}
                  </p>
                  <p className="text-gray-600">Total Lotes</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {lots
                      .reduce((sum, lot) => sum + (lot.area || 0), 0)
                      .toFixed(1)}
                  </p>
                  <p className="text-gray-600">Hectáreas Cultivadas</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {field?.superficie_ha
                      ? (
                          (lots.reduce((sum, lot) => sum + (lot.area || 0), 0) /
                            field.superficie_ha) *
                          100
                        ).toFixed(1)
                      : "0"}
                    %
                  </p>
                  <p className="text-gray-600">Utilización</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar lotes..."
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            Tabla
          </Button>
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
          >
            Tarjetas
          </Button>
        </div>
      </div>

      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <Card key={`skeleton-card-${idx}`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex-1">
                      <Skeleton className="h-5 w-24 mb-2" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-5 w-5 rounded" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))
            : lots.map((lot: any) => (
                <Card
                  key={lot.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-lg">{lot.name}</CardTitle>
                      <p className="text-sm text-gray-500">
                        LOT-{lot.id.toString().padStart(3, "0")}
                      </p>
                    </div>
                    <LayoutGrid className="w-5 h-5 text-blue-600" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Superficie:</span>
                        <span className="font-medium">{lot.area} ha</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Coordenadas:</span>
                        <span className="font-medium text-xs">
                          {lot.lat?.toFixed(4) || "-"},{" "}
                          {lot.long?.toFixed(4) || "-"}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <TableActions
                        onView={() => handleViewLot(lot.id)}
                        onEdit={() => handleEditLot(lot.id)}
                        onDelete={() => handleDeleteLot(lot.id)}
                        viewLabel="Ver Detalles"
                        forceDropdown={true}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Nombre
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Superficie (ha)
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Coordenadas
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 4 }).map((_, idx) => (
                        <tr key={`skeleton-${idx}`} className="border-b">
                          <td className="p-4">
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </td>
                          <td className="p-4">
                            <Skeleton className="h-4 w-12" />
                          </td>
                          <td className="p-4">
                            <Skeleton className="h-4 w-20" />
                          </td>
                          <td className="p-4">
                            <Skeleton className="h-4 w-24" />
                          </td>
                          <td className="p-4">
                            <Skeleton className="h-4 w-32" />
                          </td>
                          <td className="p-4">
                            <Skeleton className="h-8 w-20" />
                          </td>
                        </tr>
                      ))
                    : lots.map((lot: any) => (
                        <tr
                          key={lot.id}
                          className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleViewLot(lot.id)}
                        >
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {lot.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                LOT-{lot.id.toString().padStart(3, "0")}
                              </p>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-900">
                            {lot.area} ha
                          </td>
                          <td className="p-4 text-sm text-gray-900">
                            {lot.lat?.toFixed(4) || "-"},{" "}
                            {lot.long?.toFixed(4) || "-"}
                          </td>
                          <td className="p-4">
                            <TableActions
                              onView={() => handleViewLot(lot.id)}
                              onEdit={() => handleEditLot(lot.id)}
                              onDelete={() => handleDeleteLot(lot.id)}
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

      <CreateLotModal
        isOpen={isCreateLotModalOpen}
        onClose={() => setIsCreateLotModalOpen(false)}
        fieldId={fieldId}
        fieldName={field?.nombre || "Campo"}
        clientName={clientName}
        onLotCreated={handleLotCreated}
      />

      <EditLotModal
        isOpen={isEditLotModalOpen}
        onClose={() => {
          setIsEditLotModalOpen(false);
          setEditLot(null);
        }}
        lot={editLot}
        fieldName={field?.nombre || "Campo"}
        clientName={clientName}
        onLotUpdated={handleLotUpdated}
      />

      <AlertDialog
        open={deleteLotId !== null}
        onOpenChange={() => setDeleteLotId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El lote será eliminado
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingLot}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteLot}
              disabled={isDeletingLot}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingLot ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
