import { Plus, Search, Filter, TreePine, LayoutGrid } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useEffect, useState } from "react";
import { CreateClientModal } from "../components/CreateClientModal";
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
import { getAllClients } from "../api/services/ClientService";

export function Clients() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteClientId, setDeleteClientId] = useState<number | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [clients, setClients] = useState<ClientType[]>([]);

  useEffect(() => {
    const fetClients = async () => {
      try {
        const response = await getAllClients();
        setClients(response);
      } catch (error) {
        console.error("Error fetching machineries:", error);
      }
    };

    fetClients();
  }, []);

  const handleViewClient = (id: number) => {
    setSelectedClientId(id);
  };

  const handleEditClient = (id: number) => {
    console.log("Editing client:", id);
  };

  const handleDeleteClient = (id: number) => {
    setDeleteClientId(id);
  };

  const confirmDelete = () => {
    if (deleteClientId) {
      console.log("Deleting client:", deleteClientId);
      setDeleteClientId(null);
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
                  <tr key={client.id} className="border-b hover:bg-gray-50">
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
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <TableActions
                          onView={() => handleViewClient(client.id)}
                          onEdit={() => handleEditClient(client.id)}
                          onDelete={() => handleDeleteClient(client.id)}
                        />
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
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

function ClientFieldsView({
  clientId,
  onBack,
}: {
  clientId: number;
  onBack: () => void;
}) {
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");
  const [isCreateFieldModalOpen, setIsCreateFieldModalOpen] = useState(false);
  const [deleteFieldId, setDeleteFieldId] = useState<number | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null);
  const [editField, setEditField] = useState<any>(null);
  const [isEditFieldModalOpen, setIsEditFieldModalOpen] = useState(false);

  // Mock data for client
  const client = {
    id_cliente: clientId,
    razon_social: "Finca San José S.A.",
  };

  // Mock data for fields
  const fields = [
    {
      id_campo: 1,
      id_cliente: clientId,
      nombre: "Campo Norte",
      superficie_ha: 150.5,
      latitud: -34.6037,
      longitud: -58.3816,
      cultivo_actual: "Soja",
      lotes_count: 8,
    },
    {
      id_campo: 2,
      id_cliente: clientId,
      nombre: "Campo Sur",
      superficie_ha: 200.0,
      latitud: -34.6137,
      longitud: -58.3916,
      cultivo_actual: "Maíz",
      lotes_count: 12,
    },
  ];

  const handleViewField = (fieldId: number) => {
    setSelectedFieldId(fieldId);
  };

  const handleEditField = (fieldId: number) => {
    const field = fields.find((f) => f.id_campo === fieldId);
    if (field) {
      setEditField(field);
      setIsEditFieldModalOpen(true);
    }
  };

  const handleDeleteField = (fieldId: number) => {
    setDeleteFieldId(fieldId);
  };

  const confirmDeleteField = () => {
    if (deleteFieldId) {
      console.log("Deleting field:", deleteFieldId);
      setDeleteFieldId(null);
    }
  };

  const handleBackToFields = () => {
    setSelectedFieldId(null);
  };

  // Show field lots view when a field is selected
  if (selectedFieldId) {
    return (
      <FieldLotsView
        fieldId={selectedFieldId}
        clientName={client.razon_social}
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
              Campos de {client.razon_social}
            </h1>
            <p className="text-gray-600 mt-1">
              Administra los campos y lotes de este cliente.
            </p>
          </div>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setIsCreateFieldModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Campo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TreePine className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {fields.length}
                </p>
                <p className="text-gray-600">Total Campos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <LayoutGrid className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {fields.reduce((sum, field) => sum + field.lotes_count, 0)}
                </p>
                <p className="text-gray-600">Total Lotes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {fields
                    .reduce((sum, field) => sum + field.superficie_ha, 0)
                    .toFixed(1)}
                </p>
                <p className="text-gray-600">Hectáreas Totales</p>
              </div>
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
                {fields.map((field) => (
                  <tr
                    key={field.id_campo}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {field.nombre}
                        </p>
                        <p className="text-sm text-gray-500">
                          CAM-{field.id_campo.toString().padStart(3, "0")}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {field.superficie_ha} ha
                    </td>
                    <td className="p-4 text-sm text-green-600">
                      {field.cultivo_actual}
                    </td>
                    <td className="p-4 text-sm text-blue-600">
                      {field.lotes_count}
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {field.latitud.toFixed(4)}, {field.longitud.toFixed(4)}
                    </td>
                    <td className="p-4">
                      <TableActions
                        onView={() => handleViewField(field.id_campo)}
                        onEdit={() => handleEditField(field.id_campo)}
                        onDelete={() => handleDeleteField(field.id_campo)}
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
        clientName={client.razon_social}
      />

      <EditFieldModal
        isOpen={isEditFieldModalOpen}
        onClose={() => {
          setIsEditFieldModalOpen(false);
          setEditField(null);
        }}
        field={editField}
        clientName={client.razon_social}
      />

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
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteField}
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

function FieldLotsView({
  fieldId,
  clientName,
  onBack,
}: {
  fieldId: number;
  clientName: string;
  onBack: () => void;
}) {
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");
  const [isCreateLotModalOpen, setIsCreateLotModalOpen] = useState(false);
  const [deleteLotId, setDeleteLotId] = useState<number | null>(null);
  const [editLot, setEditLot] = useState<any>(null);
  const [isEditLotModalOpen, setIsEditLotModalOpen] = useState(false);

  // Mock data for field
  const field = {
    id_campo: fieldId,
    nombre: "Campo Norte",
    superficie_ha: 150.5,
  };

  // Mock data for lots
  const lots = [
    {
      id_lote: 1,
      id_campo: fieldId,
      nombre: "Lote A1",
      superficie_ha: 25.5,
      id_cultivo: 1,
      cultivo: "Soja",
      id_estadio: 1,
      estadio: "Vegetativo",
      latitud: -34.6037,
      longitud: -58.3816,
    },
    {
      id_lote: 2,
      id_campo: fieldId,
      nombre: "Lote A2",
      superficie_ha: 30.0,
      id_cultivo: 2,
      cultivo: "Maíz",
      id_estadio: 2,
      estadio: "Floración",
      latitud: -34.6047,
      longitud: -58.3826,
    },
  ];

  const handleViewLot = (lotId: number) => {
    console.log("Viewing lot:", lotId);
  };

  const handleEditLot = (lotId: number) => {
    const lot = lots.find((l) => l.id_lote === lotId);
    if (lot) {
      setEditLot(lot);
      setIsEditLotModalOpen(true);
    }
  };

  const handleDeleteLot = (lotId: number) => {
    setDeleteLotId(lotId);
  };

  const confirmDeleteLot = () => {
    if (deleteLotId) {
      console.log("Deleting lot:", deleteLotId);
      setDeleteLotId(null);
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
            <div className="flex items-center">
              <LayoutGrid className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {lots.length}
                </p>
                <p className="text-gray-600">Total Lotes</p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {lots
                    .reduce((sum, lot) => sum + lot.superficie_ha, 0)
                    .toFixed(1)}
                </p>
                <p className="text-gray-600">Hectáreas Cultivadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {(
                    (lots.reduce((sum, lot) => sum + lot.superficie_ha, 0) /
                      field.superficie_ha) *
                    100
                  ).toFixed(1)}
                  %
                </p>
                <p className="text-gray-600">Utilización</p>
              </div>
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
              placeholder="Buscar lotes..."
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
          {lots.map((lot) => (
            <Card
              key={lot.id_lote}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-lg">{lot.nombre}</CardTitle>
                  <p className="text-sm text-gray-500">
                    LOT-{lot.id_lote.toString().padStart(3, "0")}
                  </p>
                </div>
                <LayoutGrid className="w-5 h-5 text-blue-600" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Superficie:</span>
                    <span className="font-medium">{lot.superficie_ha} ha</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cultivo:</span>
                    <span className="font-medium text-green-600">
                      {lot.cultivo}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estadio:</span>
                    <span className="font-medium text-blue-600">
                      {lot.estadio}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Coordenadas:</span>
                    <span className="font-medium text-xs">
                      {lot.latitud.toFixed(4)}, {lot.longitud.toFixed(4)}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <TableActions
                    onView={() => handleViewLot(lot.id_lote)}
                    onEdit={() => handleEditLot(lot.id_lote)}
                    onDelete={() => handleDeleteLot(lot.id_lote)}
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
                      Cultivo
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Estadio
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
                  {lots.map((lot) => (
                    <tr key={lot.id_lote} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {lot.nombre}
                          </p>
                          <p className="text-sm text-gray-500">
                            LOT-{lot.id_lote.toString().padStart(3, "0")}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-900">
                        {lot.superficie_ha} ha
                      </td>
                      <td className="p-4 text-sm text-green-600">
                        {lot.cultivo}
                      </td>
                      <td className="p-4 text-sm text-blue-600">
                        {lot.estadio}
                      </td>
                      <td className="p-4 text-sm text-gray-900">
                        {lot.latitud.toFixed(4)}, {lot.longitud.toFixed(4)}
                      </td>
                      <td className="p-4">
                        <TableActions
                          onView={() => handleViewLot(lot.id_lote)}
                          onEdit={() => handleEditLot(lot.id_lote)}
                          onDelete={() => handleDeleteLot(lot.id_lote)}
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
        fieldName={field.nombre}
        clientName={clientName}
      />

      <EditLotModal
        isOpen={isEditLotModalOpen}
        onClose={() => {
          setIsEditLotModalOpen(false);
          setEditLot(null);
        }}
        lot={editLot}
        fieldName={field.nombre}
        clientName={clientName}
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
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteLot}
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
